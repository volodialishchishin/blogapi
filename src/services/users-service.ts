import {UserViewModel} from "../models/UserViewModel";
import bcrypt from 'bcrypt'
import {ObjectId} from "mongodb";
import {usersRepository} from "../DAL/users-repository";

export const usersService = {
    async createUser(login:string,email:string,password:string): Promise<UserViewModel> {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this.generateHash(password,passwordSalt)
        const newUser:UserViewModel & {password:string} = {
            id: new ObjectId(),
            password: passwordHash,
            login,
            email,
            createdAt: new Date().toISOString(),
        }
        return usersRepository.createUser(newUser)

    },
    async deleteBlog(id: ObjectId): Promise<boolean> {
        return  await usersRepository.deleteBlog(id)
    },
    async generateHash(password:string,salt:string){
        return await bcrypt.hash(password, salt)
    },
    async checkCredentials(login:string,password:string,salt:number): Promise<boolean> {
        const passwordSalt = await bcrypt.genSalt(salt)
        const user = await usersRepository.getUserByLogin(login)
        if (!user) return false
        const passwordHash = await this.generateHash(password,passwordSalt)
        return user.password === passwordHash;

    },
}
