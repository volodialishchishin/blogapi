import {Response, Router} from "express";
import {
    RequestWithBody, RequestWithParams,
    RequestWithQuery, UserQueryParams,
} from "../types/types";
import {body, query} from "express-validator";
import {ErrorModel} from "../models/Error/Error";
import {authMiddleware} from "../middlwares/auth-middleware";
import {UserInputModel} from "../models/User/UserInputModel";
import {UserViewModel, userViewModelWithQuery} from "../models/User/UserViewModel";
import {usersService} from "../services/users-service";
import {queryRepository} from "../DAL/query-repository";
import {inputValidationMiddlware} from "../middlwares/input-validation-middlware";

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
    authMiddleware,
    body('login').isString().trim().isLength({min: 3, max: 10}),
    body('password').isString().trim().isLength({min: 6, max: 20}),
    body('email').isString().trim().matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
    inputValidationMiddlware,
    async (req: RequestWithBody<UserInputModel>, res: Response<UserViewModel>) => {
        const {login, password, email} = req.body
        let result = await usersService.createSuperUser(login,email,password)
        res.status(201).json(result)
    })

usersRouter.delete('/:id', authMiddleware, async (req: RequestWithParams<{ id: string }>, res: Response<ErrorModel>) => {
    let result = await usersService.deleteUser(req.params.id)
    if (result) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})

