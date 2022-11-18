import {UserViewModel} from "../models/User/UserViewModel";
import bcrypt from 'bcrypt'
import {usersRepository} from "../DAL/users-repository";
import {UserModel} from "../models/User/User";

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
            passwordOr:password
        }
        return usersRepository.createUser(newUser)

    },
    async deleteUser(id: string): Promise<boolean> {
        return  await usersRepository.deleteUser(id)
    },
    async generateHash(password:string,salt:string){
        return await bcrypt.hash(password, salt)
    },
    async checkCredentials(login:string,password:string,email:string): Promise<UserModel | null | undefined> {
        const user = await usersRepository.getUserByLoginOrEmail(login,email)
        console.log(user)
        if (!user) return null
        const passwordHash = await this.generateHash(password,user.passwordSalt)
        console.log(user.password === passwordHash,user.password,passwordHash)
        if (user.password === passwordHash) {
            console.log('fsdffdsrgdsgvdfsgsdgfg')
            return user
        }
    },
}
