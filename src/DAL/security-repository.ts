import {tokensCollection} from "../DB/db";
import {DeleteResult} from "mongodb";

export const securityRepository = {
    async getSessions(userId:string) {
        return await tokensCollection.find({userId}).toArray()
    },
    async deleteSessions(userId:string): Promise<DeleteResult> {
        return await tokensCollection.deleteMany({userId})
    },
    async deleteSession(userId:string,id:string): Promise<DeleteResult> {
        return await tokensCollection.deleteOne({userId,deviceId:id})
    }
}
