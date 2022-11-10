import {MongoClient, ObjectId} from "mongodb";
import {BlogViewModel} from "../models/BlogViewModel";
import * as dotenv from 'dotenv'
dotenv.config()
if (!process.env.MONGO_URL){
    throw new Error('Url does not exist')
}

const client = new MongoClient(process.env.MONGO_URL)


export const blogsCollection = client.db().collection<BlogViewModel>('blogs')

export const runDb = async ()=>{
    try {
        console.log('success')
        await client.connect()
    } catch (e) {
        await client.close()
    }
}
