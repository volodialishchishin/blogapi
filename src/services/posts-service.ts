import {PostViewModel} from "../models/Post/PostViewModel";
import {blogsRepository} from "../DAL/blogs-repository";
import {Helpers} from "../helpers/helpers";
import {postsRepository} from "../DAL/posts.repository";
import {PostInputModel} from "../models/Post/PostInputModel";
import {PostCreatedModel, PostModel} from "../models/Post/PostModel";

export const postsService = {
    async getPosts(): Promise<PostViewModel[]> {
        return postsRepository.getPosts()
    },

    createPost: async function (blogId: string, title: string, content: string, shortDescription: string): Promise<PostCreatedModel|null> {
        let blogger = await blogsRepository.getBlog(blogId)
        let newPost:PostModel
        if (blogger){
             newPost = {
                blogName: blogger.name,
                shortDescription,
                content,
                blogId,
                title,
                id: Number(new Date).toString(),
                createdAt: new Date().toISOString()
            }
            await postsRepository.createPost(newPost)
            return Helpers.postsMapperToView(newPost)
        }
        else{
            return null
        }
    },
    async updatePost(blogId: string, title: string, content: string, shortDescription: string, id: string): Promise<boolean> {
        return await postsRepository.updatePost(blogId, title, content, shortDescription, id)
    },
    async deletePost(id: string): Promise<boolean> {
        return await postsRepository.deletePost(id)

    },
    async getPost(id: string, userId:string): Promise<PostViewModel | undefined> {

        return await postsRepository.getPost(id, userId)
    }
}
