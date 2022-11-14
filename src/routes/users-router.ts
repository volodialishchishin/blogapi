import {Response, Router} from "express";
import {
    RequestWithBody,
    RequestWithParamsAndBody, RequestWithQuery, UserQueryParams,
} from "../types/types";
import {body, query} from "express-validator";
import {BlogInputModel} from "../models/BlogInputModel";
import {ErrorModel} from "../models/Error";
import {authMiddleware} from "../middlwares/auth-middleware";
import {UserInputModel} from "../models/UserInputModel";
import {UserViewModel, userViewModelWithQuery} from "../models/UserViewModel";
import {usersService} from "../services/users-service";
import {ObjectId} from "mongodb";
import {queryRepository} from "../DAL/query-repository";

export const usersRouter = Router()

usersRouter.get('/',
    query('searchLoginTerm').isString(),
    query('searchEmailTerm').isString(),
    query('pageNumber').isNumeric(),
    query('pageSize').isNumeric(),
    query('sortBy').isString(),
    query('sortDirection').isString(),
    async (req: RequestWithQuery<UserQueryParams>, res: Response<userViewModelWithQuery>) => {
        const searchLoginTerm = req.query.searchLoginTerm || null
        const searchEmailTerm = req.query.searchEmailTerm || null
        const pageNumber = req.query.pageNumber || 1
        const sortBy = req.query.sortBy || 'createdAt'
        const pageSize = req.query.pageSize || 10
        const sortDirection = req.query.sortDirection || 'desc'
        res.status(200).json(await queryRepository.getUsers(searchLoginTerm,searchEmailTerm, pageNumber, sortBy, pageSize, sortDirection))
    })


usersRouter.post('/',
    body('login').isString().trim().isLength({min: 3, max: 10}),
    body('password').isString().trim().isLength({min: 6, max: 20}),
    body('email').isString().trim().matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
    async (req: RequestWithBody<UserInputModel>, res: Response<UserViewModel>) => {
        const {login, password, email} = req.body
        let result = await usersService.createUser(login,email,password)
        res.status(200).json(result)
    })

usersRouter.delete('/:id', authMiddleware, async (req: RequestWithParamsAndBody<{ id: string }, BlogInputModel>, res: Response<ErrorModel>) => {
    let id = new ObjectId(req.params.id)
    let result = await usersService.deleteBlog(id)
    if (result) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})

