import {CommentViewModel} from "../models/Comment/CommentViewModel";
import {commentsRepository} from "../DAL/comments-repository";
import {CommentModel} from "../models/Comment/CommentModel";

export const commentsService = {
    async createComment(postId:string,content:string,userId:string,userLogin:string): Promise<CommentViewModel> {
        const newComment: CommentModel = {
            id: Number(new Date).toString(),
            content,
            userId,
            userLogin,
            createdAt: new Date().toISOString(),
            postId
        }
        return commentsRepository.createComment(newComment)

    },
    async getComment(id:string): Promise<CommentViewModel | undefined> {
        return await commentsRepository.getCommentById(id)
    },
    async updateComment(id:string,content:string): Promise<boolean> {
        return  commentsRepository.updateComment(id,content)
    },
    async deleteComment(id:string): Promise<boolean> {
        return  commentsRepository.deleteComment(id)
    }
}
