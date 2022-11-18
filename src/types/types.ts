import {Request} from "express";
import {UserModel} from "../models/User/User";

export type RequestWithBody<T> = Request<{},{},T>
export type RequestWithParams<T> = Request<T>
export type RequestWithQuery<T> = Request<{},{},{},T>
export type RequestWithQueryAndParams<T,B> = Request<T,{},{},B>
export type RequestWithParamsAndBody<T,B> = Request<T,{},B>

export type BlogsQueryParams = {
    searchNameTerm:string
    pageNumber:number
    pageSize:number
    sortBy:string
    sortDirection:'asc'|'desc'
}
export type UserQueryParams = {
    searchEmailTerm:string
    searchLoginTerm:string
    pageNumber:number
    pageSize:number
    sortBy:string
    sortDirection:'asc'|'desc'
}
export type PostsQueryParams = {
    blogId:string
    pageNumber:number
    pageSize:number
    sortBy:string
    sortDirection: 'asc'|'desc'
}
export type CommentsQueryParams = {
    pageNumber:number
    pageSize:number
    sortBy:string
    sortDirection: 'asc'|'desc'
}

