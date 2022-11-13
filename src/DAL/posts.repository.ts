import {postsCollection} from "../DB/db";
import {PostViewModel} from "../models/PostViewModel";
import {Helpers} from "../helpers/helpers";
export const postsRepository = {
    async getPosts(): Promise<PostViewModel[]> {
        let result = await postsCollection.find({}).toArray()
        return result.map(Helpers.postsMapperToView)
    },

    async createPost(post:PostViewModel): Promise<void> {
        console.log(post)
        await postsCollection.insertOne(post)
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
            return Helpers.postsMapperToView(result[0])
        }

    }
}
