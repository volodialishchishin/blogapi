import {LikeInfoViewModelValues} from "../LikeInfo/LikeInfoViewModel";

export type ExtendedLikesInfoViewModel = {
    likesCount	:number,
    dislikesCount:number,
    myStatus:LikeInfoViewModelValues
    newestLikes: Array<{
        addedAt: Date,
        userId: string,
        login: string
    }>
}
export type PostViewModel = {
    id:string
    title:string
    shortDescription:string
    content:string
    blogId:string
    blogName:string
    createdAt: string
    extendedLikesInfo: ExtendedLikesInfoViewModel

}
export type PostViewModelWithQuery = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount:number,
    items:Array<PostViewModel>
}
