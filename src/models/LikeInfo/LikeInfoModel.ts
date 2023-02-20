import {LikeInfoViewModelValues} from "./LikeInfoViewModel";

export type LikeInfoModel = {
    id:string
    entetyId:string,
    userId:string,
    status:LikeInfoViewModelValues
    dateAdded: Date
    userLogin:string
}
