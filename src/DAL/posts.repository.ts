import {postsCollection} from "../DB/db";
import {PostViewModel} from "../models/PostViewModel";
import {blogsRepository} from "./blogs-repository";

export const postsRepository = {
    async getPosts(): Promise<PostViewModel[]> {
        return postsCollection.find({}).toArray()
    },

    async createPost(blogId:string,title:string,content:string,shortDescription:string): Promise<PostViewModel> {
        let blogger = await blogsRepository.getBlog(blogId)
        const newPost:PostViewModel = {
            blogName:blogger ? blogger.name:'',
            shortDescription,
            content,
            blogId,
            title,
            id: Number(new Date).toString()
        }
        await postsCollection.insertOne(newPost)
        return newPost

    },
    async updatePost(blogId:string,title:string,content:string,shortDescription:string,id:string): Promise<boolean> {
        let result = await postsCollection.updateOne(
            { id : id },
            { $set: { title,shortDescription,content,blogId } }
        );
        return result.matchedCount === 1

    },
    async deletePost(id:string): Promise<boolean> {
        const result = await postsCollection.deleteOne({id:id})
        console.log(result)
        return result.deletedCount === 1

    },
    async getPost(id:string): Promise<PostViewModel> {
        let result =  await postsCollection.find({id:id}).toArray()
        return result[0]

    }
}
