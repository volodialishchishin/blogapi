import {usersCollection} from "../DB/db";
import {Helpers} from "../helpers/helpers";
import {UserViewModel} from "../models/User/UserViewModel";
import {UserModel} from "../models/User/User";

export const usersRepository = {
    async createUser(user:UserModel): Promise<UserViewModel> {
        console.log(user)
        await usersCollection.insertOne(user)
        return Helpers.userMapperToView(user)
    },
    async deleteUser(id: string): Promise<boolean> {
        const result = await usersCollection.deleteOne({id: id})
        return result.deletedCount === 1
    },
    async getUserByLoginOrEmail(login: string,email:string=''):Promise<UserModel> {
        const result = await usersCollection.find({$or:[{login: login},{email: email}]}).toArray()
        console.log(login,email)
        return result[0]
    },
    async getUserById(id: string):Promise<UserModel> {
        const result = await usersCollection.find({id: id}).toArray()
        return result[0]
    }
}
