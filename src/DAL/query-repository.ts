import {blogsCollection, commentsCollection, postsCollection, usersCollection} from "../DB/db";
import {BlogViewModelWithQuery} from "../models/Blog/BlogViewModel";
import {Helpers} from "../helpers/helpers";
import {PostViewModelWithQuery} from "../models/Post/PostViewModel";
import {blogsRepository} from "./blogs-repository";
import {userViewModelWithQuery} from "../models/User/UserViewModel";
import {CommentViewModelWithQuery} from "../models/Comment/CommentViewModel";

export const queryRepository = {
    async getBlogsByBlogId(
        blogId: string,
        pageNumber: number,
        sortBy: string,
        pageSize: number,
        sortDirection: 'asc' | 'desc'): Promise<PostViewModelWithQuery | null> {
        let foundBlog = await blogsRepository.getBlog(blogId)
        if (!foundBlog) {
            return null
        }
        let result = await postsCollection.find({blogId: blogId}).skip((pageNumber - 1) * pageSize).limit(Number(pageSize)).sort(sortBy, sortDirection).toArray()
        const allPosts = await postsCollection.find({blogId: blogId}).toArray()
        const pagesCount = Math.ceil(allPosts.length / pageSize)
        return {
            pagesCount: Number(pagesCount),
            page: Number(pageNumber),
            pageSize: Number(pageSize),
            totalCount: allPosts.length,
            items: result.map(Helpers.postsMapperToView)
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
                {login: searchLoginTerm ? {$regex: searchLoginTerm, $options: 'gi'} : {$regex: '.'}},
                {email: searchEmailTerm ? {$regex: searchEmailTerm, $options: 'gi'} : {$regex: '.'}}
            ]
        }).skip((pageNumber - 1) * pageSize).limit(Number(pageSize)).sort(sortBy, sortDirection).toArray()
        const allUsers = await usersCollection.find({
            $or: [
                {login: searchLoginTerm ? {$regex: searchLoginTerm, $options: 'gi'} : {$regex: '.'}},
                {email: searchEmailTerm ? {$regex: searchEmailTerm, $options: 'gi'} : {$regex: '.'}}
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
    async getComments(
        postId: string,
        pageNumber: number,
        sortBy: string,
        pageSize: number,
        sortDirection: 'asc' | 'desc'
    ): Promise<CommentViewModelWithQuery> {
        let result = await commentsCollection.find({postId: postId}).skip((pageNumber - 1) * pageSize).limit(Number(pageSize)).sort(sortBy, sortDirection).toArray()
        console.log(postId)
        const allComments = await commentsCollection.find({id: postId}).toArray()
        const pagesCount = Math.ceil(allComments.length / pageSize)
        return {
            pagesCount: Number(pagesCount),
            page: Number(pageNumber),
            pageSize: Number(pageSize),
            totalCount: allComments.length,
            items: result.map(Helpers.commentsMapperToView)
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
    async getPosts(
        pageNumber: number,
        sortBy: string,
        pageSize: number,
        sortDirection: 'asc' | 'desc'
    ): Promise<PostViewModelWithQuery> {
        let result = await postsCollection.find({}).skip((pageNumber - 1) * pageSize).limit(Number(pageSize)).sort(sortBy, sortDirection).toArray()
        const allPosts = await postsCollection.find({}).toArray()
        const pagesCount = Math.ceil(allPosts.length / pageSize)
        return {
            pagesCount: Number(pagesCount),
            page: Number(pageNumber),
            pageSize: Number(pageSize),
            totalCount: allPosts.length,
            items: result.map(Helpers.postsMapperToView)
        }
    },
}
