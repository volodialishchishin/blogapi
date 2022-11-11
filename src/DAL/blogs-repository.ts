import {blogsCollection} from "../DB/db";
import {BlogViewModel} from "../models/BlogViewModel";

export const blogsRepository = {
    async getBlogs(): Promise<BlogViewModel[]> {
        let result = await blogsCollection.find({}).toArray()
        return result.map(e => {
                return {
                    name: e.name,
                    createdAt: e.createdAt,
                    id: e.id,
                    youtubeUrl: e.youtubeUrl
                }
            }
        )
    },

    async createBlog(name: string, youtubeUrl: string): Promise<BlogViewModel> {
        console.log('im her3')
        const newBlog:BlogViewModel = {
            id: Number(new Date).toString(),
            name,
            youtubeUrl,
            createdAt: new Date().toISOString()
        }
        console.log('im her4')
        await blogsCollection.insertOne(newBlog)
        return {
            name: newBlog.name,
            createdAt: newBlog.createdAt,
            id: newBlog.id,
            youtubeUrl: newBlog.youtubeUrl
        }

    },
    async updateBlog(name: string, youtubeUrl: string, id: string): Promise<boolean> {
        let result = await blogsCollection.updateOne(
            {id: id},
            {$set: {youtubeUrl: youtubeUrl, name: name}}
        );
        return result.matchedCount === 1

    },
    async deleteBlog(id: string): Promise<boolean> {
        const result = await blogsCollection.deleteOne({id: id})
        return result.deletedCount === 1

    },
    async getBlog(id: string): Promise<BlogViewModel | undefined> {
        let result = await blogsCollection.find({id: id}).toArray()
        if (result.length){
            return {
                name: result[0].name,
                createdAt: result[0].createdAt,
                id: result[0].id,
                youtubeUrl: result[0].youtubeUrl
            }
        }

    }
}
