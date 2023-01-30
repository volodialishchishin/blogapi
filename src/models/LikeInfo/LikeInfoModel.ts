import {LikeInfoViewModelValues} from "./LikeInfoViewModel";

export type LikeInfoModel = {
    id:string
    commentId:string,
    userId:string,
    status:LikeInfoViewModelValues
    dateAdded: Date

}
