import {Request} from "express";

export type RequestWithBody<T> = Request<{},{},T>
export type RequestWithParams<T> = Request<T>
export type RequestWithQuery<T> = Request<{},{},{},T>
export type RequestWithParamsAndBody<T,B> = Request<T,{},B>

export type BlogsQueryParams = {
    searchNameTerm:string
    pageNumber:number
    pageSize:number
    sortBy:string
    sortDirection:string
}
export type PostsQueryParams = {
    blogId:string
    pageNumber:number
    pageSize:number
    sortBy:string
    sortDirection:string
}
