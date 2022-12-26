import {commentsCollection, postsCollection, usersCollection} from "../DB/db";
import {Helpers} from "../helpers/helpers";
import {UserViewModel} from "../models/User/UserViewModel";
import {UserModel} from "../models/User/User";
import {CommentViewModel} from "../models/Comment/CommentViewModel";
import {CommentModel} from "../models/Comment/CommentModel";

export const commentsRepository = {
    async createComment(comment: CommentModel) {
        await commentsCollection.insertOne(comment)
        return Helpers.commentsMapperToView(comment)
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
    async getCommentById(id: string): Promise<CommentViewModel | undefined> {
        let comment = await commentsCollection.find({id: id}).toArray()
        if (comment.length){
            return Helpers.commentsMapperToView(comment[0])
        }
    },
    async deleteComment(id:string):Promise<boolean>{
        let result = await commentsCollection.deleteOne(
            { id : id }
        );
        return result.deletedCount === 1
    }
}
