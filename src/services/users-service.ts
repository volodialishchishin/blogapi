import {UserViewModel} from "../models/User/UserViewModel";
import bcrypt from 'bcrypt'
import {usersRepository} from "../DAL/users-repository";
import {UserModel} from "../models/User/User";
import {v4} from 'uuid'
import add from 'date-fns/add'
import {mailService} from "./mail-service";

export const usersService = {
    async createSuperUser(login:string,email:string,password:string): Promise<UserViewModel> {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this.generateHash(password,passwordSalt)
        const newUser:UserModel = {
            id: v4(),
            accountData:{
                password: passwordHash,
                passwordSalt: passwordSalt,
                login,
                email,
                createdAt: new Date().toISOString(),
            },
            emailConfirmation:{
                confirmationCode:v4(),
                confirmationDate: add(new Date(),{
                    hours:1,
                    minutes:3
                }),
                isConfirmed:true
            }

        }
        return usersRepository.createUser(newUser)
    },
    async saveUser(login:string,email:string,password:string): Promise<UserViewModel> {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this.generateHash(password,passwordSalt)
        const newUser:UserModel = {
            id: v4(),
            accountData :{
                password: passwordHash,
                passwordSalt: passwordSalt,
                login,
                email,
                createdAt:new Date().toISOString()
            },
            emailConfirmation:{
                isConfirmed:false,
                confirmationDate: add(new Date,{
                    minutes:10
                }),
                confirmationCode:v4()
            }
        }
        await mailService.sendMailConfirmation(newUser)
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
        if (!user) return null
        const passwordHash = await this.generateHash(password,user.accountData.passwordSalt)
        if (user.accountData.password === passwordHash) {
            return user
        }
    },
    async confirmCode(code:string):Promise<boolean|null>{
        const user = await usersRepository.getUserByCode(code)
        console.log(user)
        if (user && user.emailConfirmation.confirmationCode === code){
            return await usersRepository.confirmCode(user.id)
        }
        else{
            return null
        }
    }
}
