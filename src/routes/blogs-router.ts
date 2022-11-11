import {Request, Response, Router} from "express";
import {RequestWithBody, RequestWithParamsAndBody} from "../types/types";
import {body} from "express-validator";
import {BlogViewModel} from "../models/BlogViewModel";
import {BlogInputModel} from "../models/BlogInputModel";
import {inputValidationMiddlware} from "../middlwares/input-validation-middlware";
import {ErrorModel} from "../models/Error";
import {authMiddleware} from "../middlwares/auth-middleware";
import {blogsRepository} from "../DAL/blogs-repository";

export const blogsRouter = Router()

blogsRouter.get('/', async (req: Request, res: Response<Array<BlogViewModel>>) => {
    res.status(200).json(await blogsRepository.getBlogs())
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
        let result = await blogsRepository.createBlog(name, youtubeUrl)
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
        let result = await blogsRepository.updateBlog(name, youtubeUrl, req.params.id)
        if (result) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }

    }
)
blogsRouter.delete('/:id', authMiddleware, async (req: RequestWithParamsAndBody<{ id: string }, BlogInputModel>, res: Response<ErrorModel>) => {
    let result = await blogsRepository.deleteBlog(req.params.id)
    if (result) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }


})

blogsRouter.get('/:id',
    async (req: RequestWithParamsAndBody<{ id: string }, BlogInputModel>, res: Response<BlogViewModel>) => {
        let foundBlog = await blogsRepository.getBlog(req.params.id)
        if (foundBlog) {
            res.status(200).json(foundBlog)
        } else {
            res.sendStatus(404)
        }
    }
)
