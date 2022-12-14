import { Response, Router} from "express";
import {
    CommentsQueryParams,
    PostsQueryParams,
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithQuery, RequestWithQueryAndParams
} from "../types/types";
import {body, query} from "express-validator";
import {inputValidationMiddlware} from "../middlwares/input-validation-middlware";
import {ErrorModel} from "../models/Error/Error";
import {authMiddleware} from "../middlwares/auth-middleware";
import {PostViewModel, PostViewModelWithQuery} from "../models/Post/PostViewModel";
import {PostInputModel} from "../models/Post/PostInputModel";
import {postsService} from "../services/posts-service";
import {blogsRepository} from "../DAL/blogs-repository";
import {queryRepository} from "../DAL/query-repository";
import {CommentInputModel} from "../models/Comment/CommentInputModel";
import {commentsService} from "../services/comments-service";
import {authMiddlewareJwt} from "../middlwares/auth-middleware-jwt";
import {CommentViewModel, CommentViewModelWithQuery} from "../models/Comment/CommentViewModel";
import {postsRepository} from "../DAL/posts.repository";


export const postsRouter = Router()

postsRouter.get('/',
    query('pageNumber').isNumeric(),
    query('pageSize').isNumeric(),
    query('sortBy').isString(),
    query('sortDirection').isString(),
    async (req: RequestWithQuery<PostsQueryParams>, res: Response<PostViewModelWithQuery>) => {
        const pageNumber = req.query.pageNumber || 1
        const sortBy = req.query.sortBy || 'createdAt'
        const pageSize = req.query.pageSize || 10
        const sortDirection = req.query.sortDirection || 'desc'
        res.status(200).json(await queryRepository.getPosts(pageNumber, sortBy, pageSize, sortDirection))
    })

postsRouter.post('/',
    authMiddleware,
    body('blogId').isString().trim().custom(async (value, {req}) => {
        let foundBlog = await blogsRepository.getBlog(req.body.blogId)
        if (foundBlog) {
            return true;
        } else {
            throw new Error('Password confirmation does not match password');
        }
    }),
    body('shortDescription').isString().trim().isLength({min: 1, max: 100}),
    body('content').isString().trim().isLength({min: 1, max: 1000}),
    body('title').isString().trim().isLength({min: 1, max: 30}),
    inputValidationMiddlware,
    async (req: RequestWithBody<PostInputModel>, res: Response<PostViewModel>) => {
        const {blogId, title, content, shortDescription} = req.body
        let result = await postsService.createPost(blogId, title, content, shortDescription)
        if (result) {
            res.status(201).json(result)
        } else {
            res.sendStatus(404)
        }


    }
)

postsRouter.put('/:id',
    authMiddleware,
    body('blogId').isString().trim().custom(async (value, {req}) => {
        let foundBlog = await blogsRepository.getBlog(req.body.blogId)
        if (foundBlog) {
            return true;
        } else {
            throw new Error('Password confirmation does not match password');
        }
    }),
    body('shortDescription').isString().trim().isLength({min: 1, max: 100}),
    body('content').isString().trim().isLength({min: 1, max: 1000}),
    body('title').isString().trim().isLength({min: 1, max: 30}),
    inputValidationMiddlware,
    async (req: RequestWithParamsAndBody<{ id: string }, PostInputModel>, res: Response<ErrorModel>) => {
        const {title, shortDescription, content, blogId} = req.body
        let result = await postsService.updatePost(blogId, title, content, shortDescription, req.params.id)
        if (result) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    }
)
postsRouter.delete('/:id', authMiddleware, async (req: RequestWithParamsAndBody<{ id: string }, PostInputModel>, res: Response<ErrorModel>) => {
        let result = await postsService.deletePost(req.params.id)
        if (result) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    }
)

postsRouter.get('/:id', async (req: RequestWithParams<{ id: string }>, res: Response<PostViewModel>) => {
        let result = await postsService.getPost(req.params.id)
        if (result) {
            res.status(200).json(result)
        } else {
            res.sendStatus(404)
        }
    }
)
postsRouter.post('/:id/comments',
    authMiddlewareJwt,
    body('content').isString().trim().isLength({min: 20, max: 300}),
    inputValidationMiddlware,
    async (req: RequestWithParamsAndBody<{ id: string }, CommentInputModel>, res: Response<CommentViewModel>) => {
        const {content} = req.body
        const {context: {user} = {}} = req
        let foundPost = await postsRepository.getPost(req.params.id)
        if (!foundPost) {
          res.sendStatus(404)
        }
        else{
            let result = await commentsService.createComment(req.params.id, content, user!.id, user!.accountData.login)
            res.status(201).json(result)
        }
    }
)

postsRouter.get('/:id/comments',
    query('pageNumber').isNumeric(),
    query('pageSize').isNumeric(),
    query('sortBy').isString(),
    query('sortDirection').isString(),
    async (req: RequestWithQueryAndParams<{id:string},CommentsQueryParams>, res: Response<CommentViewModelWithQuery>) => {
        const pageNumber = req.query.pageNumber || 1
        const sortBy = req.query.sortBy || 'createdAt'
        const pageSize = req.query.pageSize || 10
        const sortDirection = req.query.sortDirection || 'desc'
        let result = await queryRepository.getComments(req.params.id,pageNumber, sortBy, pageSize, sortDirection)
        result.items.length ? res.status(200).json(result):res.sendStatus(404)
    })

