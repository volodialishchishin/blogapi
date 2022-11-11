import {blogsCollection} from "../DB/db";
import {BlogViewModel} from "../models/BlogViewModel";

export const blogsRepository = {
    async getBlogs(): Promise<BlogViewModel[]> {
        return blogsCollection.find({}).toArray()
    },

    async createBlog(name:string,youtubeUrl:string): Promise<BlogViewModel> {
        const newPost = {
            id: Number(new Date).toString(),
            name,
            youtubeUrl
        }
        await blogsCollection.insertOne(newPost)
        return newPost

    },
    async updateBlog(name:string,youtubeUrl:string,id:string): Promise<boolean> {
        let result = await blogsCollection.updateOne(
            { id : id },
            { $set: { youtubeUrl : youtubeUrl,name:name } }
        );
        return result.matchedCount === 1

    },
    async deleteBlog(id:string): Promise<boolean> {
        const result = await blogsCollection.deleteOne({id:id})
        return result.deletedCount === 1

    },
    async getBlog(id:string): Promise<BlogViewModel> {
        let result =  await blogsCollection.find({id:id}).toArray()
        return result[0]

    }
}
