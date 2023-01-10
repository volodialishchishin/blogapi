import {PostViewModel} from "../models/Post/PostViewModel";
import {BlogViewModel} from "../models/Blog/BlogViewModel";
import {UserViewModel} from "../models/User/UserViewModel";
import {CommentViewModel} from "../models/Comment/CommentViewModel";
import {UserModel} from "../models/User/User";
import {TokenModel} from "../models/Token/TokenModel";

export const Helpers = {
    postsMapperToView(post:PostViewModel): PostViewModel{
        return {
            id: post.id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
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
    commentsMapperToView(comment:CommentViewModel): CommentViewModel{
        return {
            content: comment.content,
            userId: comment.userId,
            userLogin: comment.userLogin,
            id: comment.id,
            createdAt: comment.createdAt,
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
