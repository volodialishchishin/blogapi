import {UserViewModel} from "../models/UserViewModel";
import bcrypt from 'bcrypt'
import {usersRepository} from "../DAL/users-repository";
import {UserModel} from "../models/User";

export const usersService = {
    async createUser(login:string,email:string,password:string): Promise<UserViewModel> {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this.generateHash(password,passwordSalt)
        const newUser:UserModel = {
            id: new Date().toISOString(),
            password: passwordHash,
            passwordSalt: passwordSalt,
            login,
            email,
            createdAt: new Date().toISOString(),
        }
        return usersRepository.createUser(newUser)

    },
    async deleteBlog(id: string): Promise<boolean> {
        return  await usersRepository.deleteBlog(id)
    },
    async generateHash(password:string,salt:string){
        return await bcrypt.hash(password, salt)
    },
    async checkCredentials(login:string,password:string): Promise<boolean> {
        const user = await usersRepository.getUserByLogin(login)
        console.log(user)
        if (!user) return false
        const passwordHash = await this.generateHash(password,user.passwordSalt)
        console.log(user.password,passwordHash)
        return user.password === passwordHash;

    },
}
