import {Request, Response, Router} from "express";
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody} from "../types/types";
import {body} from "express-validator";
import {inputValidationMiddlware} from "../middlwares/input-validation-middlware";
import {ErrorModel} from "../models/Error";
import {authMiddleware} from "../middlwares/auth-middleware";
import {PostViewModel} from "../models/PostViewModel";
import {PostInputModel} from "../models/PostInputModel";
import {blogs, posts} from "../index";


export const postsRouter = Router()

postsRouter.get('/', (req: Request, res: Response<Array<PostViewModel>>) => {
    res.status(200).json(posts)
})

postsRouter.post('/',
    authMiddleware,
    body('blogId').isString().trim().custom((value, { req })=>{
        let foundBlog = blogs.find(s=>s.id===req.body.blogId)
        if (foundBlog){
            return true;
        }
        else{
            throw new Error('Password confirmation does not match password');
        }
    }),
    body('shortDescription').isString().trim().isLength({min:1,max: 100}),
    body('content').isString().trim().isLength({min:1,max: 1000}),
    body('title').isString().trim().isLength({min:1,max: 30}),
    inputValidationMiddlware,
    (req: RequestWithBody<PostInputModel>, res: Response<PostViewModel>) => {
        const { blogId,title,content,shortDescription } = req.body
        let bloger = blogs.find(s=>s.id===req.body.blogId)
        const newPost:PostViewModel = {
            blogName:bloger ? bloger.name:'',
            shortDescription,
            content,
            blogId,
            title,
            id: Number(new Date).toString()
        }
        posts.push(newPost)
        res.status(201).json(newPost)
    }
)

postsRouter.put('/:id',
    authMiddleware,
    body('blogId').isString().trim().custom((value, { req })=>{
        let foundBlog = blogs.find(s=>s.id===req.body.blogId)
        if (foundBlog){
            return true;
        }
        else{
            throw new Error('Password confirmation does not match password');
        }
    }),
    body('shortDescription').isString().trim().isLength({min:1,max: 100}),
    body('content').isString().trim().isLength({min:1,max: 1000}),
    body('title').isString().trim().isLength({min:1,max: 30}),
    inputValidationMiddlware,
    (req: RequestWithParamsAndBody<{id:string},PostInputModel>, res: Response<ErrorModel>) => {
        const {title,shortDescription,content,blogId } = req.body
        let foundPost = posts.find(e => e.id === req.params.id)
        if (foundPost){
            foundPost.title = title
            foundPost.shortDescription = shortDescription
            foundPost.content = content
            foundPost.blogId = blogId
            res.sendStatus(204)
        }
        else{
            res.sendStatus(404)
        }

    }
)
postsRouter.delete('/:id', authMiddleware,(req: RequestWithParamsAndBody<{id:string},PostInputModel>, res: Response<ErrorModel>) => {
        let foundPost = posts.find(e => e.id === req.params.id)
        if (foundPost){
            // @ts-ignore
            posts = posts.filter(c => c.id !== req.params.id)
            res.sendStatus(204)
        }
        else{
            res.sendStatus(404)
        }

    }
)

postsRouter.get('/:id', (req: RequestWithParams<{id:string}>, res: Response<PostViewModel>) => {
        let foundPost = posts.find(e => e.id === req.params.id)
        if (foundPost){
            res.status(200).json(foundPost)
        }
        else{
            res.sendStatus(404)
        }
    }
)
