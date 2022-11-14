import {usersCollection} from "../DB/db";
import {Helpers} from "../helpers/helpers";
import {UserViewModel} from "../models/UserViewModel";
import {ObjectId} from "mongodb";
import {UserModel} from "../models/User";

export const usersRepository = {
    async createUser(user:UserViewModel & {password:string}): Promise<UserViewModel> {
        await usersCollection.insertOne(user)
        return Helpers.userMapperToView(user)
    },
    async deleteBlog(id: ObjectId): Promise<boolean> {
        const result = await usersCollection.deleteOne({id: id})
        return result.deletedCount === 1
    },
    async getUserByLogin(login: string):Promise<UserModel> {
        const result = await usersCollection.find({login: login}).toArray()
        return result[0]
    }
}
