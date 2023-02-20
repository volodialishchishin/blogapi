import {commentsCollection, likesCollection, postsCollection} from "../DB/db";
import {PostViewModel} from "../models/Post/PostViewModel";
import {Helpers} from "../helpers/helpers";
import {LikeInfoViewModelValues} from "../models/LikeInfo/LikeInfoViewModel";
import {LikeInfoModel} from "../models/LikeInfo/LikeInfoModel";
import {v4} from "uuid";
import {PostModel} from "../models/Post/PostModel";
export const postsRepository = {
    async getPosts(): Promise<PostViewModel[]> {
        let result = await postsCollection.find({}).toArray()
        let mappedResult = await Promise.all(result.map(Helpers.postsMapperToView))
        return  mappedResult
    },

    async createPost(post: PostModel): Promise<void> {
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
        return result.deletedCount === 1

    },
    async getPost(id:string ,userId:string): Promise<PostViewModel | undefined> {
        const result = await postsCollection.findOne({id})
        if (result){
            let postToView  = await Helpers.postsMapperToView(result);

            if (!userId){
                return postToView
            }
            let likeStatus = await likesCollection.findOne({userId,commentId:id})
            let lastLikes = await likesCollection.find({entetyId:id, status: LikeInfoViewModelValues.like}).sort({dateAdded:-1}).limit(3).toArray()
            let mappedLastLikes = lastLikes.map(e=>{
                return{
                    addedAt: e.dateAdded,
                    userId: e.userId,
                    login: e.userLogin
                }
            })
            if (likeStatus){
                postToView.extendedLikesInfo.myStatus = likeStatus?.status || LikeInfoViewModelValues.none

            }
            postToView.extendedLikesInfo.newestLikes = mappedLastLikes
            return postToView
        }
        else{
            return undefined
        }

    },
    async updateLikeStatus(likeStatus: LikeInfoViewModelValues, userId: string, postId: string, login:string) {
        let post = await postsCollection.findOne({id:postId})
        if (!post){
            return false
        }
        const like = await likesCollection.findOne({postId,userId})
        if (!like){
            const status:LikeInfoModel = {
                id:v4(),
                entetyId: postId,
                userId,
                status: likeStatus,
                dateAdded: new Date(),
                userLogin:login
            }
            await likesCollection.insertOne(status)
        }
        else{
            if (likeStatus === LikeInfoViewModelValues.none){
                await likesCollection.deleteOne({userId:like.userId,entetyId:like.entetyId})
            }else{
                await likesCollection.updateOne({postId,userId},{$set:{status:likeStatus}})
            }
        }
        return true
    }
}
