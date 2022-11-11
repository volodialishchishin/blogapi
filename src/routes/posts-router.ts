import {Request, Response, Router} from "express";
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody} from "../types/types";
import {body} from "express-validator";
import {inputValidationMiddlware} from "../middlwares/input-validation-middlware";
import {ErrorModel} from "../models/Error";
import {authMiddleware} from "../middlwares/auth-middleware";
import {PostViewModel} from "../models/PostViewModel";
import {PostInputModel} from "../models/PostInputModel";
import {postsRepository} from "../DAL/posts.repository";
import {blogsRepository} from "../DAL/blogs-repository";


export const postsRouter = Router()

postsRouter.get('/', async (req: Request, res: Response<Array<PostViewModel>>) => {
    res.status(200).json(await postsRepository.getPosts())
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
        let result = await postsRepository.createPost(blogId, title, content, shortDescription)
        res.status(201).json(result)
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
        let result = await postsRepository.updatePost(blogId, title, content, shortDescription, req.params.id)
        if (result) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    }
)
postsRouter.delete('/:id', authMiddleware, async (req: RequestWithParamsAndBody<{ id: string }, PostInputModel>, res: Response<ErrorModel>) => {
        let result = await postsRepository.deletePost(req.params.id)
        if (result) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    }
)

postsRouter.get('/:id', async (req: RequestWithParams<{ id: string }>, res: Response<PostViewModel>) => {
        let result = await postsRepository.getPost(req.params.id)
        if (result) {
            res.status(200).json(result)
        } else {
            res.sendStatus(404)
        }
    }
)
