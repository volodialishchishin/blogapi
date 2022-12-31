import {Request, Response, Router} from "express";
import {RequestWithBody} from "../types/types";
import {usersService} from "../services/users-service";
import {body} from "express-validator";
import {LoginInputModel} from "../models/Login/LoginInputModel";
import {jwtService} from "../Application/jwt-service";
import {authMiddlewareJwt} from "../middlwares/auth-middleware-jwt";
import {usersRepository} from "../DAL/users-repository";
import {RegisterModelInput} from "../models/Registration/RegisterModelInput";
import {inputValidationMiddlware} from "../middlwares/input-validation-middlware";
import {mailService} from "../services/mail-service";
import {usersCollection} from "../DB/db";
import {v4} from 'uuid'
import emailValidator from 'deep-email-validator';
const emailExistence = require('email-existence')


import emailCheck from 'email-check';


export const authRouter = Router()

authRouter.post('/login',
    body('login').optional().isString().trim().isLength({min: 3, max: 10}),
    body('email').optional().isString().trim().matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
    body('password').isString().trim().isLength({min: 6, max: 20}),
    inputValidationMiddlware,
    async (req: RequestWithBody<LoginInputModel>, res: Response) => {
        const user = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password, req.body.loginOrEmail)
        if (user) {
            const token = jwtService.generateTokens(user)
            await jwtService.saveToken(user.id, token.refreshToken);
            res.cookie('refreshToken', token.refreshToken, {secure:true, httpOnly: true})
            res.status(200).json({accessToken: token})
        } else {
            res.sendStatus(401)
        }
    }
)
authRouter.post('/refresh-token',
    async (req: Request, res: Response) => {
        try {
            const {refreshToken} = req.cookies;
            const tokens = await usersService.refresh(refreshToken);
            if (tokens){
                res.cookie('refreshToken', tokens.refreshToken, {secure:true, httpOnly: true})
                return res.json(tokens.accessToken);
            }

        } catch (e) {
            res.sendStatus(401)
        }
    }
)
authRouter.post('/logout',
    async (req: Request, res: Response) => {
        try {
            const {refreshToken} = req.cookies;
            await usersService.logout(refreshToken);
            res.clearCookie('refreshToken');
            res.sendStatus(204)
        } catch (e) {
            res.sendStatus(401)
        }
    }
)
authRouter.post('/registration',
    body('login').isString().trim().isLength({min: 3, max: 10}).custom(async (value, {req}) => {
        let user = await usersRepository.getUserByLoginOrEmail(req.body.login)
        if (user) {
            throw Error('User Already exists')
        }
        return true;
    }),
    body('email').isString().trim().matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).custom(async (value, {req}) => {
        let user = await usersRepository.getUserByLoginOrEmail('', req.body.email)
        if (user) {
            throw Error('User Already exists')
        }
        return true;
    }),
    body('password').isString().trim().isLength({min: 6, max: 20}),
    inputValidationMiddlware,
    async (req: RequestWithBody<RegisterModelInput>, res: Response) => {
        const user = await usersService.saveUser(req.body.login, req.body.email, req.body.password)
        if (user) {
            res.sendStatus(204)
        } else res.sendStatus(400)
    }
)
authRouter.post('/registration-confirmation',
    body('code').isString().trim().isLength({min: 1}).custom(async (value, {req}) => {
        let user = await usersRepository.getUserByCode(req.body.code)
        console.log(!user,user.emailConfirmation.confirmationCode,!user.emailConfirmation?.confirmationCode )
        if (!user || user.emailConfirmation.isConfirmed || !user.emailConfirmation?.confirmationCode  ) {
            throw Error('User Already exists')
        }
        return true;
    }),
    inputValidationMiddlware,
    async (req: RequestWithBody<{ code: string }>, res: Response) => {

        const status = await usersService.confirmCode(req.body.code)
        if (status) {
            res.sendStatus(204)
        } else res.sendStatus(400)
    }
)
authRouter.post('/registration-email-resending',
    body('email').isString().trim().matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).custom(async (value, {req}) => {
        let user = await usersRepository.getUserByLoginOrEmail('',req.body.email)
        if  (user?.emailConfirmation?.isConfirmed || !user) {
            throw Error('User Already exists')
        }
        return true;
    }),
    inputValidationMiddlware,
    async (req: RequestWithBody<{ email: string }>, res: Response) => {
        let user = await usersRepository.getUserByLoginOrEmail('',req.body.email)
        if (user){
            let newCode = v4()
            await usersCollection.updateOne({id:user.id},{$set:{"emailConfirmation.confirmationCode":newCode}})
            await mailService.sendMailConfirmation(user,true,newCode)
            res.sendStatus(204)
        }
        else{
            res.sendStatus(400)
        }
    }
)
async function isEmailValid(email:string) {
    return emailValidator(email)
}
authRouter.get('/me',
    authMiddlewareJwt,
    async (req: Request, res: Response) => {
        const user = req.context.user?.id ? await usersRepository.getUserById(req.context.user?.id) : null
        if (user && user.emailConfirmation.isConfirmed) {
            res.status(200).json({
                email: user.accountData.email,
                login: user.accountData.login,
                userId: user.id
            })
        } else {
            res.sendStatus(401)
        }
    }
)
