import {LikeInfoViewModel} from "../LikeInfo/LikeInfoViewModel";

export type CommentViewModel = {
    id:string
    commentatorInfo:{
        userId:string
        userLogin:string
    },
    content:string
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
