import {PostViewModel} from "../models/Post/PostViewModel";
import {BlogViewModel} from "../models/Blog/BlogViewModel";
import {UserViewModel} from "../models/User/UserViewModel";
import {UserModel} from "../models/User/User";
import {TokenModel} from "../models/Token/TokenModel";
import {CommentModel} from "../models/Comment/CommentModel";
import {likesCollection} from "../DB/db";
import {LikeInfoViewModelValues} from "../models/LikeInfo/LikeInfoViewModel";
import {CommentViewModel} from "../models/Comment/CommentViewModel";
import {PostCreatedModel, PostModel} from "../models/Post/PostModel";

export const Helpers = {
    async postsMapperToView(post:PostModel): Promise<PostViewModel>{
        let likesCount = await likesCollection.find({entetyId:post.id, status: LikeInfoViewModelValues.like}).toArray()
        let disLikesCount = await likesCollection.find({entetyId:post.id,status: LikeInfoViewModelValues.dislike }).toArray()
        return {
            id: post.id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
            extendedLikesInfo:{
                likesCount: likesCount.length,
                dislikesCount: disLikesCount.length,
                myStatus:LikeInfoViewModelValues.none,
                newestLikes:[]
            }
        }
    },
    blogsMapperToView(blog:BlogViewModel): BlogViewModel{
        return {
            id: blog.id,
            name: blog.name,
            createdAt: blog.createdAt,
            websiteUrl: blog.websiteUrl,
        }
    },
    userMapperToView(user: UserModel): UserViewModel{
        return {
            id: user.id,
            email: user.accountData.email,
            createdAt: user.accountData.createdAt,
            login:user.accountData.login
        }
    },
    async commentsMapperToView(comment:CommentModel): Promise<CommentViewModel>{
        let likesCount = await likesCollection.find({commentId:comment.id, status: LikeInfoViewModelValues.like}).toArray()
        let disLikesCount = await likesCollection.find({commentId:comment.id,status: LikeInfoViewModelValues.dislike }).toArray()
        return {
            content: comment.content,
            commentatorInfo:{
                userId: comment.userId,
                userLogin: comment.userLogin,
            },
            id: comment.id,
            createdAt: comment.createdAt,
            likesInfo:{
                likesCount: likesCount.length,
                dislikesCount: disLikesCount.length,
                myStatus:LikeInfoViewModelValues.none
            }
        }
    },
    deviceMapperToView (token:TokenModel) {
        return {
            deviceId:token.deviceId,
            lastActiveDate:token.lastActiveDate,
            ip:token.ip,
            title:token.title
        }
    }
}
