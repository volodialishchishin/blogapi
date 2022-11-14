import {PostViewModel} from "../models/PostViewModel";
import {BlogViewModel} from "../models/BlogViewModel";
import {UserViewModel} from "../models/UserViewModel";

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
            youtubeUrl: blog.youtubeUrl,
        }
    },
    userMapperToView(user:UserViewModel): UserViewModel{
        return {
            id: user.id,
            email: user.email,
            createdAt: user.createdAt,
            login:user.login
        }
    }
}
