import {BlogViewModel} from "../models/Blog/BlogViewModel";
import {blogsRepository} from "../DAL/blogs-repository";

export const blogsService = {
    async getBlogs(): Promise<BlogViewModel[]> {
        return blogsRepository.getBlogs()
    },

    async createBlog(name: string, websiteUrl: string): Promise<BlogViewModel> {
        const newBlog: BlogViewModel = {
            id: Number(new Date).toString(),
            name,
            websiteUrl,
            createdAt: new Date().toISOString()
        }
        return blogsRepository.createBlog(newBlog)

    }
    ,
    async updateBlog(name: string, websiteUrl: string, id: string): Promise<boolean> {
        return blogsRepository.updateBlog(name ,websiteUrl, id)

    },
    async deleteBlog(id: string): Promise<boolean> {
        return  await blogsRepository.deleteBlog(id)

    },
    async getBlog(id: string): Promise<BlogViewModel | null> {
        return blogsRepository.getBlog(id)
    }
}
