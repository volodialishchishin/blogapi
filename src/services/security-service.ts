import {securityRepository} from "../DAL/security-repository";
import jwt from "jsonwebtoken";
import {DeleteResult} from "mongodb";

export const securityService = {
    async getSessions(refreshToken:string) {
        const { user } = <jwt.UserIDJwtPayload>jwt.verify(refreshToken, process.env.SECRET || 'Ok')
        return await securityRepository.getSessions(user)
    },
    async deleteSessions(refreshToken:string) {
        const { user, deviceId } = <jwt.UserIDJwtPayload>jwt.verify(refreshToken, process.env.SECRET || 'Ok')
        return await securityRepository.deleteSessions(user, deviceId)
    },
    async deleteSession(refreshToken:string, id:string): Promise<DeleteResult> {

        const { user } = <jwt.UserIDJwtPayload>jwt.verify(refreshToken, process.env.SECRET || 'Ok')
        try {
            await securityRepository.getSession(user,id)
        }
        catch (e) {
            throw new Error('User with this id can not delete this session')
        }
        return await securityRepository.deleteSession(user,id)
    }
}
