import {UserModel} from "../models/User/User";
import jwt, {JwtPayload, UserIDJwtPayload} from "jsonwebtoken"
import * as dotenv from "dotenv";
import {tokensCollection} from "../DB/db";

dotenv.config()

export const jwtService = {
    generateTokens(user: UserModel) {
        let accessToken =  jwt.sign({user: user.id,email:user.accountData.email,login:user.accountData.login,}, process.env.SECRET || 'Ok', {expiresIn: '10'})
        let refreshToken =  jwt.sign({user: user.id}, process.env.SECRET || 'Ok', {expiresIn: '20'})
        return {
            accessToken,
            refreshToken
        }
    },

    getUserIdByToken(token: string) {

            console.log(token)
            const result: any = jwt.verify(token, process.env.SECRET || 'Ok')
        console.log(result)
            return result




    },
    async saveToken(userId: string, refreshToken: string) {
        const tokenData = await tokensCollection.findOne({user: userId})
        if (tokenData) {
            let status = await tokensCollection.updateOne({user: userId},{$set:{refreshToken,}})
            return status.modifiedCount

        }
        return await tokensCollection.insertOne({userId, refreshToken});
    },
    validateRefreshToken(refreshToken: string) :string | null {
        try {
            const { userId } = <jwt.UserIDJwtPayload>jwt.verify(refreshToken, process.env.SECRET || 'Ok')
            return userId;
        } catch (e) {
            return null;
        }
    }
}
