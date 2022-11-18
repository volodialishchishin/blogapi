import {CommentViewModel} from "../models/Comment/CommentViewModel";
import {commentsRepository} from "../DAL/comments-repository";

export const commentsService = {
    async createComment(postId:string,content:string,userId:string,userLogin:string): Promise<CommentViewModel> {
        const newComment: CommentViewModel = {
            id: Number(new Date).toString(),
            content,
            userId,
            userLogin,
            createdAt: new Date().toISOString()
        }
        return commentsRepository.createComment(newComment)

    },
    async getComment(id:string): Promise<CommentViewModel> {
        return await commentsRepository.getCommentById(id)
    },
    async updateComment(id:string,content:string): Promise<boolean> {
        return  commentsRepository.updateComment(id,content)
    },
    async deleteComment(id:string): Promise<boolean> {
        return  commentsRepository.deleteComment(id)
    }
}
