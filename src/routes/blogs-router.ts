import {Request, Response, Router} from "express";
import {RequestWithBody, RequestWithParamsAndBody} from "../types/types";
import {body} from "express-validator";
import {BlogViewModel} from "../models/BlogViewModel";
import {BlogInputModel} from "../models/BlogInputModel";
import {inputValidationMiddlware} from "../middlwares/input-validation-middlware";
import {ErrorModel} from "../models/Error";
import {authMiddleware} from "../middlwares/auth-middleware";
import {blogs} from "../index";

export const blogsRouter = Router()

blogsRouter.get('/', (req: Request, res: Response<Array<BlogViewModel>>) => {
    res.status(200).json(blogs)
})

blogsRouter.post('/',
    authMiddleware,
    body('name').isString().trim().isLength({min:1,max: 15}),
    body('youtubeUrl').isString().trim().isLength({min:1,max: 100}).matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/),
    inputValidationMiddlware,
    (req: RequestWithBody<BlogInputModel>, res: Response<BlogViewModel>) => {
        const {name, youtubeUrl } = req.body
        const newPost = {
            id: Number(new Date).toString(),
            name,
            youtubeUrl
        }
        blogs.push(newPost)
        res.status(201).json(newPost)

    }
)

blogsRouter.put('/:id',
    authMiddleware,
    body('name').isString().trim().isLength({min:1,max: 15}),
    body('youtubeUrl').isString().trim().isLength({min:1,max: 100}).matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/),
    inputValidationMiddlware,
    (req: RequestWithParamsAndBody<{id:string},BlogInputModel>, res: Response<ErrorModel>) => {
        const {name, youtubeUrl } = req.body
        let foundBlog = blogs.find(e => e.id === req.params.id)
        if (foundBlog){
            foundBlog.name = name
            foundBlog.youtubeUrl = youtubeUrl
            res.sendStatus(204)
        }
        else{
            res.sendStatus(404)
        }

    }
)
blogsRouter.delete('/:id', authMiddleware,(req: RequestWithParamsAndBody<{id:string},BlogInputModel>, res: Response<ErrorModel>) => {
    let foundBlog = blogs.find(e => e.id === req.params.id)
    if (foundBlog){
        // @ts-ignore
        blogs = blogs.filter(c => c.id !== req.params.id)
        res.sendStatus(204)
    }
    else{
        res.sendStatus(404)
    }

})

blogsRouter.get('/:id', (req: RequestWithParamsAndBody<{id:string},BlogInputModel>, res: Response<BlogViewModel>) => {
        let foundBlog = blogs.find(e => e.id === req.params.id)
    console.log(req.params.id)
    console.log(blogs)
        if (foundBlog){
            res.status(200).json(foundBlog)
        }
        else{
            res.sendStatus(404)
        }
    }
)
