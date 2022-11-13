import {Request, Response, Router} from "express";
import {
    BlogsQueryParams, PostsQueryParams,
    RequestWithBody,
    RequestWithParamsAndBody,
    RequestWithQuery
} from "../types/types";
import {body, query} from "express-validator";
import {BlogViewModel, BlogViewModelWithQuery} from "../models/BlogViewModel";
import {BlogInputModel} from "../models/BlogInputModel";
import {inputValidationMiddlware} from "../middlwares/input-validation-middlware";
import {ErrorModel} from "../models/Error";
import {authMiddleware} from "../middlwares/auth-middleware";
import {blogsService} from "../services/blogs-service";
import {BlogPostInputModel} from "../models/BlogPostInputModel";
import {postsService} from "../services/posts-service";
import {PostViewModel, PostViewModelWithQuery} from "../models/PostViewModel";
import {queryRepository} from "../DAL/query-repository";

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
        console.log(pageSize)
        const sortDirection = req.query.sortDirection || 'desc'
        res.status(200).json(await queryRepository.getBlogsByBlogId(req.params.blogId, pageNumber, sortBy, pageSize, sortDirection))
    })

blogsRouter.post('/',
    authMiddleware,
    body('name').isString().trim().isLength({min: 1, max: 15}),
    body('youtubeUrl').isString().trim().isLength({
        min: 1,
        max: 100
    }).matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/),
    inputValidationMiddlware,
    async (req: RequestWithBody<BlogInputModel>, res: Response<BlogViewModel>) => {
        const {name, youtubeUrl} = req.body
        console.log('im here')
        let result = await blogsService.createBlog(name, youtubeUrl)
        console.log('im here1')
        res.status(201).json(result)
    }
)

blogsRouter.put('/:id',
    authMiddleware,
    body('name').isString().trim().isLength({min: 1, max: 15}),
    body('youtubeUrl').isString().trim().isLength({
        min: 1,
        max: 100
    }).matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/),
    inputValidationMiddlware,
    async (req: RequestWithParamsAndBody<{ id: string }, BlogInputModel>, res: Response<ErrorModel>) => {
        const {name, youtubeUrl} = req.body
        let result = await blogsService.updateBlog(name, youtubeUrl, req.params.id)
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
    async (req: RequestWithParamsAndBody<{ blogId: string }, BlogPostInputModel>, res: Response<PostViewModel>) => {
        const {content, shortDescription, title} = req.body
        let result = await postsService.createPost(req.params.blogId, title, content, shortDescription)
        if (!result){
            res.status(404)
        }
        res.status(201).json(result)
    }
)
