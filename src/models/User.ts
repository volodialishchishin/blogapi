import {ObjectId} from "mongodb";

export type UserModel = {
    id:ObjectId
    login:string
    email:string
    createdAt:string
    password:string
}
