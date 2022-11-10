import {blogsCollection} from "../DB/db";
import {BlogViewModel} from "../models/BlogViewModel";
import {BlogInputModel} from "../models/BlogInputModel";
import {InsertOneResult} from "mongodb";

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

    }
}
