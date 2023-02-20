import {blogsCollection} from "../DB/db";
import {BlogViewModel} from "../models/Blog/BlogViewModel";
import {Helpers} from "../helpers/helpers";

export const blogsRepository = {
    async getBlogs(): Promise<BlogViewModel[]> {
        let result = await blogsCollection.find({}).toArray()
        return result.map(Helpers.blogsMapperToView)
    },

    async createBlog(blog:BlogViewModel): Promise<BlogViewModel> {
        await blogsCollection.insertOne(blog)
        return Helpers.blogsMapperToView(blog)

    },
    async updateBlog(name: string, websiteUrl: string, id: string): Promise<boolean> {
        let result = await blogsCollection.updateOne(
            {id: id},
            {$set: {websiteUrl: websiteUrl, name: name}}
        );
        return result.matchedCount === 1

    },
    async deleteBlog(id: string): Promise<boolean> {
        const result = await blogsCollection.deleteOne({id: id})
        return result.deletedCount === 1

    },
    async getBlog(id: string): Promise<BlogViewModel | null> {
        let result = await blogsCollection.find({id: id}).toArray()
        return result[0] ? Helpers.blogsMapperToView(result[0]) : null
    }
}
