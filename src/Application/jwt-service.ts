import {UserModel} from "../models/User/User";
import jwt, {JwtPayload, UserIDJwtPayload} from "jsonwebtoken"
import * as dotenv from "dotenv";
import {tokensCollection} from "../DB/db";

dotenv.config()

export const jwtService = {
    generateTokens(user: UserModel) {
        let accessToken =  jwt.sign({user: user.id,email:user.accountData.email,login:user.accountData.login}, process.env.SECRET || 'Ok', {expiresIn: '10s'})
        let refreshToken =  jwt.sign({user: user.id}, process.env.SECRET || 'Ok', {expiresIn: '20s'})
        return {
            accessToken,
            refreshToken
        }
    },

    getUserIdByToken(token: string) {
            try {
                const result: any = jwt.verify(token, process.env.SECRET || 'Ok')
                return result
            }catch (e) {
                return null
            }
    },
    async saveToken(userId: string, refreshToken: string) {
        const tokenData = await tokensCollection.find({userId: userId}).toArray()
        if (tokenData.length) {
            let status = await tokensCollection.updateOne({userId: userId},{$set:{refreshToken}})
            console.log('status.modifiedCount',status.modifiedCount)
            return status.modifiedCount

        }
        return await tokensCollection.insertOne({userId, refreshToken});
    },
    validateRefreshToken(refreshToken: string) :string | null {
        console.log(refreshToken)
        try {
            const { user } = <jwt.UserIDJwtPayload>jwt.verify(refreshToken, process.env.SECRET || 'Ok')

            return user;
        } catch (e) {
            return null;
        }
    }
}
