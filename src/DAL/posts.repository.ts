import {postsCollection} from "../DB/db";
import {PostViewModel} from "../models/PostViewModel";
import {blogsRepository} from "./blogs-repository";

export const postsRepository = {
    async getPosts(): Promise<PostViewModel[]> {
        let result = await postsCollection.find({}).toArray()
        return result.map(e=>{
            return{
                id:e.id,
                title:e.title,
                shortDescription:e.shortDescription,
                content:e.content,
                blogId:e.blogId,
                blogName:e.blogName,
                createdAt: e.createdAt,
            }
        })
    },

    async createPost(blogId:string,title:string,content:string,shortDescription:string): Promise<PostViewModel> {
        let blogger = await blogsRepository.getBlog(blogId)
        const newPost:PostViewModel = {
            blogName:blogger ? blogger.name:'',
            shortDescription,
            content,
            blogId,
            title,
            id: Number(new Date).toString(),
            createdAt: new Date().toISOString()
        }
        await postsCollection.insertOne(newPost)
         return{
            id:newPost.id,
            title:newPost.title,
            shortDescription:newPost.shortDescription,
            content:newPost.content,
            blogId:newPost.blogId,
            blogName:newPost.blogName,
            createdAt: newPost.createdAt,
        }

    },
    async updatePost(blogId:string,title:string,content:string,shortDescription:string,id:string): Promise<boolean> {
        let result = await postsCollection.updateOne(
            { id : id },
            { $set: { title:title,
                    shortDescription:shortDescription,
                    content:content,
                    blogId:blogId } }
        );
        return result.matchedCount === 1

    },
    async deletePost(id:string): Promise<boolean> {
        const result = await postsCollection.deleteOne({id:id})
        console.log(result)
        return result.deletedCount === 1

    },
    async getPost(id:string): Promise<PostViewModel | undefined> {
        let result =  await postsCollection.find({id:id}).toArray()
        if (result.length){
            return{
                id:result[0].id,
                title:result[0].title,
                shortDescription:result[0].shortDescription,
                content:result[0].content,
                blogId:result[0].blogId,
                blogName:result[0].blogName,
                createdAt: result[0].createdAt,
            }
        }

    }
}
