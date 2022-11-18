import {UserModel} from "../models/User/User";
import jwt, {JwtPayload} from "jsonwebtoken"
import * as dotenv from "dotenv";

dotenv.config()

export const jwtService = {
    createJWT(user: UserModel) {
        return jwt.sign({user: user.id}, process.env.SECRET || 'Ok', {expiresIn: '1h'})
    },

    getUserIdByToken(token: string) {
        try {

            const result: any = jwt.verify(token, process.env.SECRET || 'Ok')
            console.log(result)
            return result.user


        } catch (e) {
            return null
        }

    }
}
