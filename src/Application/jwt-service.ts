import {UserModel} from "../models/User/User";
import jwt, {JwtPayload} from "jsonwebtoken"
import * as dotenv from "dotenv";

dotenv.config()

export const jwtService = {
    createJWT(user: UserModel) {
        if (!process.env.SECRET) {
            throw new Error('Url does not exist')
        }
        return jwt.sign({user: user.id}, process.env.SECRET, {expiresIn: '1h'})
    },

    getUserIdByToken(token: string) {
        try {
            if (process.env.SECRET) {
                const result:any = jwt.verify(token, process.env.SECRET)
                return result.user
            }

        } catch (e) {
            return null
        }

    }
}
