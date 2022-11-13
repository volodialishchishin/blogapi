import {PostViewModel} from "../models/PostViewModel";
import {blogsRepository} from "../DAL/blogs-repository";
import {Helpers} from "../helpers/helpers";
import {postsRepository} from "../DAL/posts.repository";

export const postsService = {
    async getPosts(): Promise<PostViewModel[]> {
        return postsRepository.getPosts()
    },

    createPost: async function (blogId: string, title: string, content: string, shortDescription: string): Promise<PostViewModel> {
        let blogger = await blogsRepository.getBlog(blogId)
        const newPost: PostViewModel = {
            blogName: blogger ? blogger.name : '',
            shortDescription,
            content,
            blogId,
            title,
            id: Number(new Date).toString(),
            createdAt: new Date().toISOString()
        }
        await postsRepository.createPost(newPost)
        return Helpers.postsMapperToView(newPost)

    },
    async updatePost(blogId: string, title: string, content: string, shortDescription: string, id: string): Promise<boolean> {
        return await postsRepository.updatePost(blogId, title, content, shortDescription, id)
    },
    async deletePost(id: string): Promise<boolean> {
        return await postsRepository.deletePost(id)

    },
    async getPost(id: string): Promise<PostViewModel | undefined> {
        return await postsRepository.getPost(id)
    }
}
