import {blogsCollection, postsCollection} from "../DB/db";
import {BlogViewModel, BlogViewModelWithQuery} from "../models/BlogViewModel";
import {Helpers} from "../helpers/helpers";
import {PostViewModel, PostViewModelWithQuery} from "../models/PostViewModel";
import {blogsRepository} from "./blogs-repository";

export const queryRepository = {
    async getBlogsByBlogId(blogId:string,
                           pageNumber:number,
                           sortBy:string,
                           pageSize:number,
                           sortDirection:'asc'|'desc'): Promise<PostViewModelWithQuery | null> {
        let foundBlog = await blogsRepository.getBlog(blogId)
        if (!foundBlog){
            return null
        }
        let result = await postsCollection.find({blogId:blogId}).skip((pageNumber - 1) * pageSize).limit(Number(pageSize)).sort(sortBy, sortDirection).toArray()
        const allPosts = await this.getAllPosts()
        const pagesCount = Math.ceil(allPosts.length/pageSize)
        return {
            pagesCount:Number(pagesCount),
            page: Number(pageNumber),
            pageSize:Number(pageSize),
            totalCount:allPosts.length,
            items:result.map(Helpers.postsMapperToView)
        }
    },
    async getAllBlogs(): Promise<BlogViewModel[]> {
        let result = await blogsCollection.find({}).toArray()
        return result.map(Helpers.blogsMapperToView)
    },
    async getAllPosts(): Promise<Array<PostViewModel>> {
        let result = await postsCollection.find({}).toArray()
        return result.map(Helpers.postsMapperToView)
    },
    async getBlogs(searchNameTerm: string | null,
                   pageNumber: number,
                   sortBy: string,
                   pageSize: number,
                   sortDirection: 'asc' | 'desc'
    ): Promise<BlogViewModelWithQuery> {
        let result = await blogsCollection.find({name:searchNameTerm?{$regex:searchNameTerm ,$options:'gi'}:{$regex:'.'}}).skip((pageNumber-1)*pageSize).limit(Number(pageSize)).sort(sortBy,sortDirection).toArray()
        const allBlogs = await blogsCollection.find({name:searchNameTerm?{$regex:searchNameTerm ,$options:'gi'}:{$regex:'.'}}).toArray()
        const pagesCount = Math.ceil(allBlogs.length/pageSize)
        return {
            pagesCount:Number(pagesCount),
            page: Number(pageNumber),
            pageSize:Number(pageSize),
            totalCount:allBlogs.length,
            items:result.map(Helpers.blogsMapperToView)
        }
    },
    async getPosts(pageNumber:number,
                   sortBy:string,
                   pageSize:number,
                   sortDirection:'asc'| 'desc'
    ): Promise<PostViewModelWithQuery> {
        let result = await postsCollection.find({}).skip((pageNumber-1)*pageSize).limit(Number(pageSize)).sort(sortBy,sortDirection).toArray()
        const allPosts = await this.getAllPosts()
        const pagesCount = Math.ceil(allPosts.length/pageSize)
        return {
            pagesCount:Number(pagesCount),
            page: Number(pageNumber),
            pageSize:Number(pageSize),
            totalCount:allPosts.length,
            items:result.map(Helpers.postsMapperToView)
        }
    },
}
