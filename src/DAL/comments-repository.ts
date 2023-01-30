import {commentsCollection, likesCollection} from "../DB/db";
import {Helpers} from "../helpers/helpers";
import {CommentViewModel} from "../models/Comment/CommentViewModel";
import {CommentModel} from "../models/Comment/CommentModel";
import {LikeInfoViewModelValues} from "../models/LikeInfo/LikeInfoViewModel";
import {LikeInfoModel} from "../models/LikeInfo/LikeInfoModel";
import {v4} from "uuid";

export const commentsRepository = {
    async createComment(comment: CommentModel) {
        await commentsCollection.insertOne(comment)
    },
    async updateComment(id: string, content: string): Promise<boolean> {
        let result = await commentsCollection.updateOne(
            {id: id},
            {
                $set: {
                    content: content,
                }
            }
        );
        return result.matchedCount === 1
    },
    async getCommentById(id: string,userId:String): Promise<CommentViewModel | undefined> {
        try {
            const comment = await commentsCollection.findOne({userId,id})
            if (comment){
                let commentToView  = await Helpers.commentsMapperToView(comment);
                let likeStatus = await likesCollection.findOne({userId,commentId:id})
                commentToView.likesInfo.myStatus = likeStatus?.status || LikeInfoViewModelValues.none
                return commentToView
            }

        }
        catch (e) {
            console.log(e)
        }
    },
    async deleteComment(id:string):Promise<boolean>{
        let result = await commentsCollection.deleteOne(
            { id : id }
        );
        return result.deletedCount === 1
    },
    async updateLikeStatus(likeStatus: LikeInfoViewModelValues, userId: string, commentId: string) {
        let comment = this.getCommentById(commentId,userId)
        if (!comment){
            return false
        }
        const like = await likesCollection.findOne({commentId,userId})
        if (!like){
            const status:LikeInfoModel = {
                id:v4(),
                commentId,
                userId,
                status: likeStatus,
                dateAdded: new Date()
            }
            await likesCollection.insertOne(status)

        }
        if (like && like.status !== likeStatus){
            const like = await likesCollection.findOne({commentId,userId})
            if (like){
                like.status = likeStatus
                like.dateAdded = new Date();
            }
        }
        return true
    }
}
