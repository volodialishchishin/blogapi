import {securityRepository} from "../DAL/security-repository";
import jwt from "jsonwebtoken";

export const securityService = {
    async getSessions(refreshToken:string) {
        const { user } = <jwt.UserIDJwtPayload>jwt.verify(refreshToken, process.env.SECRET || 'Ok')
        return await securityRepository.getSessions(user)
    },
    async deleteSessions(refreshToken:string) {
        const { user } = <jwt.UserIDJwtPayload>jwt.verify(refreshToken, process.env.SECRET || 'Ok')
        return await securityRepository.deleteSessions(user)
    },
    async deleteSession(refreshToken:string, id:string) {
        const { user } = <jwt.UserIDJwtPayload>jwt.verify(refreshToken, process.env.SECRET || 'Ok')
        return await securityRepository.deleteSession(user,id)
    }
}
