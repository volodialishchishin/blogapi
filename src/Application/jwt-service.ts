import {UserModel} from "../models/User/User";
import jwt, {JwtPayload, UserIDJwtPayload} from "jsonwebtoken"
import * as dotenv from "dotenv";
import {tokensCollection} from "../DB/db";
import {v4} from "uuid";

dotenv.config()

export const jwtService = {
    generateTokens(user: UserModel,deviceId:string) {
        let accessToken =  jwt.sign({user: user.id,email:user.accountData.email,login:user.accountData.login}, process.env.SECRET || 'Ok', {expiresIn: '10m'})
        let refreshToken =  jwt.sign({user: user.id, deviceId:deviceId}, process.env.SECRET || 'Ok', {expiresIn: '20s'})
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
    async saveToken(userId: string, refreshToken: string, ip:string, device:string) {
        const { deviceId } = <jwt.UserIDJwtPayload>jwt.verify(refreshToken, process.env.SECRET || 'Ok')
        const tokenData = await tokensCollection.findOne({userId: userId})
        if (tokenData && deviceId === tokenData.deviceId) {
            let status = await tokensCollection.updateOne({userId: userId},{$set:{refreshToken,lastActiveDate:new Date().toISOString()}})
            console.log('status.modifiedCount',status.modifiedCount)
            return status.modifiedCount

        }
        return await tokensCollection.insertOne({
            deviceId,
            ip,
            title: deviceId,
            userId,
            refreshToken,
            lastActiveDate: new Date().toISOString()
        });
    },
    validateRefreshToken(refreshToken: string) :{user:string,deviceId:string} | null {
        console.log(refreshToken)
        try {
            const { user, deviceId } = <jwt.UserIDJwtPayload>jwt.verify(refreshToken, process.env.SECRET || 'Ok')

            return {
                user,
                deviceId
            };
        } catch (e) {
            return null;
        }
    }
}
