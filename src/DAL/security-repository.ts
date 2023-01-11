import {tokensCollection} from "../DB/db";
import {DeleteResult} from "mongodb";
import {TokenModel} from "../models/Token/TokenModel";
import {Helpers} from "../helpers/helpers";

export const securityRepository = {
    async getSessions(userId:string) {
        let device =  await tokensCollection.find({userId}).toArray()
        return device.map(Helpers.deviceMapperToView)
    },
    async deleteSessions(userId:string, deviceId:string): Promise<DeleteResult> {
        return await tokensCollection.deleteMany({userId, deviceId:{$ne:deviceId}})
    },
    async deleteSession(userId:string,id:string): Promise<DeleteResult> {
        return await tokensCollection.deleteOne({userId,deviceId:id})
    },
    async getSession(userId:string,id:string): Promise<TokenModel> {
        let session  =  await tokensCollection.findOne({deviceId:id})
        if (session?.userId !== userId){
            throw new Error()
        }
        return session
    }
}
