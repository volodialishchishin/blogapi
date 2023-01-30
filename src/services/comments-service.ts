import {CommentViewModel} from "../models/Comment/CommentViewModel";
import {commentsRepository} from "../DAL/comments-repository";
import {CommentModel} from "../models/Comment/CommentModel";
import {LikeInfoViewModelValues} from "../models/LikeInfo/LikeInfoViewModel";

export const commentsService = {
    async createComment(postId:string,content:string,userId:string,userLogin:string): Promise<string> {
        const newComment: CommentModel = {
            id: Number(new Date).toString(),
            content,
            userId,
            userLogin,
            createdAt: new Date().toISOString(),
            postId,
        }
        await commentsRepository.createComment(newComment)
        return newComment!.id

    },
    async getComment(id:string, userId:string): Promise<CommentViewModel | undefined> {
        return await commentsRepository.getCommentById(id, userId)
    },
    async updateComment(id:string,content:string): Promise<boolean> {
        return  commentsRepository.updateComment(id,content)
    },
    async deleteComment(id:string): Promise<boolean> {
        return  commentsRepository.deleteComment(id)
    }
}
