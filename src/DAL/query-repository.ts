import {blogsCollection, commentsCollection, likesCollection, postsCollection, usersCollection} from "../DB/db";
import {BlogViewModelWithQuery} from "../models/Blog/BlogViewModel";
import {Helpers} from "../helpers/helpers";
import {PostViewModelWithQuery} from "../models/Post/PostViewModel";
import {blogsRepository} from "./blogs-repository";
import {userViewModelWithQuery} from "../models/User/UserViewModel";
import {CommentViewModelWithQuery} from "../models/Comment/CommentViewModel";
import {LikeInfoViewModelValues} from "../models/LikeInfo/LikeInfoViewModel";

export const queryRepository = {
    async getBlogsByBlogId(
        blogId: string,
        pageNumber: number,
        sortBy: string,
        pageSize: number,
        sortDirection: 'asc' | 'desc',
        userId:string): Promise<PostViewModelWithQuery | null> {
        let foundBlog = await blogsRepository.getBlog(blogId)
        if (!foundBlog) {
            return null
        }
        let matchedPosts = await postsCollection.find({blogId: blogId}).skip((pageNumber - 1) * pageSize).limit(Number(pageSize)).sort(sortBy, sortDirection).toArray()
        const allPosts = await postsCollection.find({blogId: blogId}).toArray()
        const pagesCount = Math.ceil(allPosts.length / pageSize)
        const matchedCommentsWithLikes = await Promise.all(matchedPosts.map(async post=>{
            const mappedPost = await Helpers.postsMapperToView(post)
            let lastLikes = await likesCollection.find({entetyId:post.id, status: LikeInfoViewModelValues.like}).sort({dateAdded:-1}).limit(3).toArray()
            mappedPost.extendedLikesInfo.newestLikes = lastLikes.map(e => {
                return {
                    addedAt: e.dateAdded,
                    userId: e.userId,
                    login: e.userLogin
                }
            })
            if (!userId){
                return mappedPost
            }

            let myLikeForComment = await likesCollection.findOne({
                userId,
                entetyId:post.id
            })
            if (myLikeForComment){
                mappedPost.extendedLikesInfo.myStatus = myLikeForComment.status
                return mappedPost
            }
            return mappedPost
        }))

        return {
            pagesCount: Number(pagesCount),
            page: Number(pageNumber),
            pageSize: Number(pageSize),
            totalCount: allPosts.length,
            items: matchedCommentsWithLikes
        }
    },
    async getUsers(
        searchLoginTerm: string | null,
        searchEmailTerm: string | null,
        pageNumber: number,
        sortBy: string,
        pageSize: number,
        sortDirection: 'asc' | 'desc'
    ): Promise<userViewModelWithQuery> {
        let result = await usersCollection.find({
            $or: [
                {"accountData.login": searchLoginTerm ? {$regex: searchLoginTerm, $options: 'gi'} : {$regex: '.'}},
                {"accountData.email": searchEmailTerm ? {$regex: searchEmailTerm, $options: 'gi'} : {$regex: '.'}}
            ]
        }).skip((pageNumber - 1) * pageSize).limit(Number(pageSize)).sort(sortBy, sortDirection).toArray()
        const allUsers = await usersCollection.find({
            $or: [
                {"accountData.login": searchLoginTerm ? {$regex: searchLoginTerm, $options: 'gi'} : {$regex: '.'}},
                {"accountData.email": searchEmailTerm ? {$regex: searchEmailTerm, $options: 'gi'} : {$regex: '.'}}
            ]
        }).toArray()
        const pagesCount = Math.ceil(allUsers.length / pageSize)
        return {
            pagesCount: Number(pagesCount),
            page: Number(pageNumber),
            pageSize: Number(pageSize),
            totalCount: allUsers.length,
            items: result.map(Helpers.userMapperToView)
        }
    },

    async getBlogs(
        searchNameTerm: string | null,
        pageNumber: number,
        sortBy: string,
        pageSize: number,
        sortDirection: 'asc' | 'desc'
    ): Promise<BlogViewModelWithQuery> {
        let result = await blogsCollection.find({
            name: searchNameTerm ? {
                $regex: searchNameTerm,
                $options: 'gi'
            } : {$regex: '.'}
        }).skip((pageNumber - 1) * pageSize).limit(Number(pageSize)).sort(sortBy, sortDirection).toArray()
        const allBlogs = await blogsCollection.find({
            name: searchNameTerm ? {$regex: searchNameTerm, $options: 'gi'} : {$regex: '.'}
        }).toArray()
        const pagesCount = Math.ceil(allBlogs.length / pageSize)
        return {
            pagesCount: Number(pagesCount),
            page: Number(pageNumber),
            pageSize: Number(pageSize),
            totalCount: allBlogs.length,
            items: result.map(Helpers.blogsMapperToView)
        }
    },

    async getComments(
        postId: string,
        pageNumber: number,
        sortBy: string,
        pageSize: number,
        sortDirection: 'asc' | 'desc',
        userId:string
    ): Promise<CommentViewModelWithQuery> {
        let matchedComments = await commentsCollection.find({postId: postId}).skip((pageNumber - 1) * pageSize).limit(Number(pageSize)).sort(sortBy, sortDirection).toArray()
        const allComments = await commentsCollection.find({postId: postId}).toArray()
        const pagesCount = Math.ceil(allComments.length / pageSize)
        const matchedCommentsWithLikes = await Promise.all(matchedComments.map(async comment=>{
            const mappedComment = await Helpers.commentsMapperToView(comment)
            if (!userId){
                return mappedComment
            }

            let myLikeForComment = await likesCollection.findOne({
                userId,
                entetyId:comment.id
            })

            if (myLikeForComment){
                mappedComment.likesInfo.myStatus = myLikeForComment.status
                return mappedComment
            }
            return mappedComment
        }))

        return {
            pagesCount: Number(pagesCount),
            page: Number(pageNumber),
            pageSize: Number(pageSize),
            totalCount: allComments.length,
            items: matchedCommentsWithLikes
        }
    },
    async getPosts(
        pageNumber: number,
        sortBy: string,
        pageSize: number,
        sortDirection: 'asc' | 'desc',
        userId:string
    ): Promise<PostViewModelWithQuery> {
        let matchedPosts = await postsCollection.find({}).skip((pageNumber - 1) * pageSize).limit(Number(pageSize)).sort(sortBy, sortDirection).toArray()
        const allPosts = await postsCollection.find({}).toArray()
        const pagesCount = Math.ceil(allPosts.length / pageSize)
        const matchedCommentsWithLikes = await Promise.all(matchedPosts.map(async post=>{
            const mappedPost = await Helpers.postsMapperToView(post)
            let lastLikes = await likesCollection.find({entetyId:post.id, status: LikeInfoViewModelValues.like}).sort({dateAdded:-1}).limit(3).toArray()
            mappedPost.extendedLikesInfo.newestLikes = lastLikes.map(e => {
                return {
                    addedAt: e.dateAdded,
                    userId: e.userId,
                    login: e.userLogin
                }
            })
            if (!userId){
                return mappedPost
            }

            let myLikeForComment = await likesCollection.findOne({
                userId,
                entetyId:post.id
            })
            if (myLikeForComment){
                mappedPost.extendedLikesInfo.myStatus = myLikeForComment.status
                return mappedPost
            }
            return mappedPost
        }))
        return {
            pagesCount: Number(pagesCount),
            page: Number(pageNumber),
            pageSize: Number(pageSize),
            totalCount: allPosts.length,
            items: matchedCommentsWithLikes
        }
    },
}
