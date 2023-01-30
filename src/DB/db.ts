import {MongoClient} from "mongodb";
import {BlogViewModel} from "../models/Blog/BlogViewModel";
import * as dotenv from 'dotenv'
import {PostViewModel} from "../models/Post/PostViewModel";
import {UserModel} from "../models/User/User";
import {CommentViewModel} from "../models/Comment/CommentViewModel";
import {CommentModel} from "../models/Comment/CommentModel";
import {TokenModel} from "../models/Token/TokenModel";
import {RecoveryPasswordModel} from "../models/PasswordRecovery/RecoveryPasswordModel";
import {LikeInfoModel} from "../models/LikeInfo/LikeInfoModel";
dotenv.config()
if (!process.env.MONGO_URL){
    throw new Error('Url does not exist')
}

const client = new MongoClient(process.env.MONGO_URL)


export const blogsCollection = client.db().collection<BlogViewModel>('blogs')
export const postsCollection = client.db().collection<PostViewModel>('posts')
export const usersCollection = client.db().collection<UserModel>('users')
export const commentsCollection = client.db().collection<CommentModel>('comments')
export const tokensCollection = client.db().collection<TokenModel>('tokens')
export const recoveryPasswordModelCollection = client.db().collection<RecoveryPasswordModel>('recoveryCodes')
export const likesCollection = client.db().collection<LikeInfoModel>('likes')

export const runDb = async ()=>{
    try {
        await client.connect()
    } catch (e) {
        await client.close()
    }
}
