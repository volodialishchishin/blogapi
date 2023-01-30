import {LikeInfoViewModel} from "../LikeInfo/LikeInfoViewModel";

export type CommentViewModel = {
    id:string
    content:string
    userId:string
    userLogin:string
    createdAt:string,
    likesInfo: LikeInfoViewModel
}
export type CommentViewModelWithQuery = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount:number,
    items:Array<CommentViewModel>
}
