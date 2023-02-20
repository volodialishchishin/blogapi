import {Request, Response, Router} from "express";
import {
    BlogsQueryParams, PostsQueryParams,
    RequestWithBody,
    RequestWithParamsAndBody,
    RequestWithQuery
} from "../types/types";
import {body, query} from "express-validator";
import {BlogViewModel, BlogViewModelWithQuery} from "../models/Blog/BlogViewModel";
import {BlogInputModel} from "../models/Blog/BlogInputModel";
import {inputValidationMiddlware} from "../middlwares/input-validation-middlware";
import {ErrorModel} from "../models/Error/Error";
import {authMiddleware} from "../middlwares/auth-middleware";
import {blogsService} from "../services/blogs-service";
import {BlogPostInputModel} from "../models/Blog/BlogPostInputModel";
import {postsService} from "../services/posts-service";
import {PostViewModel, PostViewModelWithQuery} from "../models/Post/PostViewModel";
import {queryRepository} from "../DAL/query-repository";
import {PostCreatedModel} from "../models/Post/PostModel";
import {jwtService} from "../Application/jwt-service";

export const blogsRouter = Router()

blogsRouter.get('/',
    query('searchNameTerm').isString(),
    query('pageNumber').isNumeric(),
    query('pageSize').isNumeric(),
    query('sortBy').isString(),
    query('sortDirection').isString(),
    async (req: RequestWithQuery<BlogsQueryParams>, res: Response<BlogViewModelWithQuery>) => {
        const searchNameTerm = req.query.searchNameTerm || null
        const pageNumber = req.query.pageNumber || 1
        const sortBy = req.query.sortBy || 'createdAt'
        const pageSize = req.query.pageSize || 10
        const sortDirection = req.query.sortDirection || 'desc'
        res.status(200).json(await queryRepository.getBlogs(searchNameTerm, pageNumber, sortBy, pageSize, sortDirection))
    })

blogsRouter.get('/:blogId/posts', query('searchNameTerm').isString(),
    query('pageNumber').isNumeric(),
    query('pageSize').isNumeric(),
    query('sortBy').isString(),
    query('sortDirection').isString(), async (req: Request<{blogId:string},{},{},PostsQueryParams>, res: Response<PostViewModelWithQuery>) => {
        const pageNumber = req.query.pageNumber || 1

        const sortBy = req.query.sortBy || 'createdAt'
        const pageSize = req.query.pageSize || 10
        const sortDirection = req.query.sortDirection || 'desc'
        const authToken = req.headers.authorization?.split(' ')[1] || ''
        const user = jwtService.getUserIdByToken(authToken)
        let result = await queryRepository.getBlogsByBlogId(req.params.blogId, pageNumber, sortBy, pageSize, sortDirection,user?.user)
        if (result){
            res.status(200).json(result)
        }
        else{
            res.sendStatus(404)
        }
    })

blogsRouter.post('/',
    authMiddleware,
    body('name').isString().trim().isLength({min: 1, max: 15}),
    body('websiteUrl').isString().trim().isLength({
        min: 1,
        max: 100
    }).matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/),
    inputValidationMiddlware,
    async (req: RequestWithBody<BlogInputModel>, res: Response<BlogViewModel>) => {
        const {name, websiteUrl} = req.body
        let result = await blogsService.createBlog(name, websiteUrl)
        res.status(201).json(result)
    }
)

blogsRouter.put('/:id',
    authMiddleware,
    body('name').isString().trim().isLength({min: 1, max: 15}),
    body('websiteUrl').isString().trim().isLength({
        min: 1,
        max: 100
    }).matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/),
    inputValidationMiddlware,
    async (req: RequestWithParamsAndBody<{ id: string }, BlogInputModel>, res: Response<ErrorModel>) => {
        const {name, websiteUrl} = req.body
        let result = await blogsService.updateBlog(name, websiteUrl, req.params.id)
        if (result) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }

    }
)
blogsRouter.delete('/:id', authMiddleware, async (req: RequestWithParamsAndBody<{ id: string }, BlogInputModel>, res: Response<ErrorModel>) => {
    let result = await blogsService.deleteBlog(req.params.id)
    if (result) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})

blogsRouter.get('/:id',
    async (req: RequestWithParamsAndBody<{ id: string }, BlogInputModel>, res: Response<BlogViewModel>) => {
        let foundBlog = await blogsService.getBlog(req.params.id)
        if (foundBlog) {
            res.status(200).json(foundBlog)
        } else {
            res.sendStatus(404)
        }
    }
)

blogsRouter.post('/:blogId/posts',
    authMiddleware,
    body('title').isString().trim().isLength({min: 1, max: 30}),
    body('shortDescription').isString().trim().isLength({min: 1, max: 100}),
    body('content').isString().trim().isLength({min: 1, max: 1000}),
    inputValidationMiddlware,
    async (req: RequestWithParamsAndBody<{ blogId: string }, BlogPostInputModel>, res: Response<PostCreatedModel>) => {
        const {content, shortDescription, title} = req.body
        let result = await postsService.createPost(req.params.blogId, title, content, shortDescription)
        if (result){
            res.status(201).json(result)
        }
        else{
            res.sendStatus(404)
        }
    }
)
