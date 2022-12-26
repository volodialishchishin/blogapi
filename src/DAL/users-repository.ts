import {usersCollection} from "../DB/db";
import {Helpers} from "../helpers/helpers";
import {UserViewModel} from "../models/User/UserViewModel";
import {UserModel} from "../models/User/User";

export const usersRepository = {
    async createUser(user:UserModel): Promise<UserViewModel> {
        await usersCollection.insertOne(user)
        return Helpers.userMapperToView(user)
    },
    async deleteUser(id: string): Promise<boolean> {
        const result = await usersCollection.deleteOne({id: id})
        return result.deletedCount === 1
    },
    async confirmCode(id:string): Promise<boolean> {
        const result = await usersCollection.updateOne({id: id},{$set:{"emailConfirmation.isConfirmed":true}})
        return result.modifiedCount === 1
    },
    async getUserByLoginOrEmail(login: string,email:string=''):Promise<UserModel> {
        const result = await usersCollection.find({$or:[{"accountData.login":login},{"accountData.email":email}]}).toArray()
        console.log('dasdad',login)
        return result[0]
    },
    async getUserByCode(code:string):Promise<UserModel> {
        const result = await usersCollection.find({"emailConfirmation.confirmationCode":code}).toArray()
        return result[0]
    },
    async getUserById(id: string):Promise<UserModel> {
        const result = await usersCollection.find({id: id}).toArray()
        return result[0]
    }
}
