import {ObjectId} from "mongodb";
export type UserViewModel = {
    id:ObjectId
    login:string
    email:string
    createdAt:string
}
export type userViewModelWithQuery = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount:number,
    items:Array<UserViewModel>
}
