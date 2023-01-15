import {Request, Response, Router} from "express";
import {RequestWithBody} from "../types/types";
import {usersService} from "../services/users-service";
import {body, header} from "express-validator";
import {LoginInputModel} from "../models/Login/LoginInputModel";
import {jwtService} from "../Application/jwt-service";
import {authMiddlewareJwt} from "../middlwares/auth-middleware-jwt";
import {usersRepository} from "../DAL/users-repository";
import {RegisterModelInput} from "../models/Registration/RegisterModelInput";
import {inputValidationMiddlware} from "../middlwares/input-validation-middlware";
import {mailService} from "../services/mail-service";
import {recoveryPasswordModelCollection, usersCollection} from "../DB/db";
import {v4} from 'uuid';
import rateLimit from 'express-rate-limit'
import {NewRecoveryInputModel} from "../models/PasswordRecovery/NewRecoveryInputModel";
import {PasswordRecoveryInputModel} from "../models/PasswordRecovery/PasswordRecoveryInputModel";
import bcrypt from "bcrypt";


const loginLimiter = rateLimit({
    windowMs: 10000,
    max: 5,
    message:
        'Too many accounts created from this IP, please try again after an hour',
    standardHeaders: true,
    legacyHeaders: false,
})

const registrationConfirmationLimiter = rateLimit({
    windowMs: 10000,
    max: 5,
    message:
        'Too many accounts created from this IP, please try again after an hour',
    standardHeaders: true,
    legacyHeaders: false,
})

const registrationLimiter = rateLimit({
    windowMs: 10000,
    max: 5,
    message:
        'Too many accounts created from this IP, please try again after an hour',
    standardHeaders: true,
    legacyHeaders: false,
})
const registrationEmailResendingLimiter = rateLimit({
    windowMs: 10000,
    max: 5,
    message:
        'Too many accounts created from this IP, please try again after an hour',
    standardHeaders: true,
    legacyHeaders: false,
})
const recoveryPasswordLimiter = rateLimit({
    windowMs: 10000,
    max: 5,
    message:
        'Too many accounts created from this IP, please try again after an hour',
    standardHeaders: true,
    legacyHeaders: false,
})
const newPasswordLimiter = rateLimit({
    windowMs: 10000,
    max: 5,
    message:
        'Too many accounts created from this IP, please try again after an hour',
    standardHeaders: true,
    legacyHeaders: false,
})

const registrationEmailResending = rateLimit({
    windowMs: 10000,
    max: 5,
    message:
        'Too many accounts created from this IP, please try again after an hour',
    standardHeaders: true,
    legacyHeaders: false,
})


export const authRouter = Router()

authRouter.post('/login',
    loginLimiter,
    body('login').optional().isString().trim().isLength({min: 3, max: 10}),
    body('email').optional().isString().trim().matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
    body('password').isString().trim().isLength({min: 6, max: 20}),
    inputValidationMiddlware,
    async (req: RequestWithBody<LoginInputModel>, res: Response) => {
        const user = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password, req.body.loginOrEmail)
        if (user && req.headers["user-agent"]) {
            let deviceId = v4()
            const token = jwtService.generateTokens(user, deviceId)
            await jwtService.saveToken(user.id, token.refreshToken, req.ip, req.headers["user-agent"]);
            res.cookie('refreshToken', token.refreshToken, {secure: true, httpOnly: true})
            res.status(200).json({accessToken: token.accessToken})
        } else {
            res.sendStatus(401)
        }
    }
)
authRouter.post('/refresh-token',
    async (req: Request, res: Response) => {
        try {
            const {refreshToken} = req.cookies;
            let tokens;
            if (req.headers["user-agent"]) {
                tokens = await usersService.refresh(refreshToken, req.headers["user-agent"], req.ip);
            }
            if (tokens) {
                res.cookie('refreshToken', tokens.refreshToken, {secure: true, httpOnly: true})
                return res.json({accessToken: tokens.accessToken});
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
            res.sendStatus(204);
        } catch (e) {
            res.sendStatus(401)
        }
    }
)
authRouter.post('/registration',
    registrationLimiter,
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
    registrationConfirmationLimiter,
    body('code').isString().trim().isLength({min: 1}).custom(async (value, {req}) => {
        let user = await usersRepository.getUserByCode(req.body.code)
        if (!user || user.emailConfirmation.isConfirmed || !user.emailConfirmation?.confirmationCode) {
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
    registrationEmailResendingLimiter,
    body('email').isString().trim().matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).custom(async (value, {req}) => {
        let user = await usersRepository.getUserByLoginOrEmail('', req.body.email)
        if (user?.emailConfirmation?.isConfirmed || !user) {
            throw Error('User Already exists')
        }
        return true;
    }),
    inputValidationMiddlware,
    async (req: RequestWithBody<{ email: string }>, res: Response) => {
        let user = await usersRepository.getUserByLoginOrEmail('', req.body.email)
        if (user) {
            let newCode = v4()
            await usersCollection.updateOne({id: user.id}, {$set: {"emailConfirmation.confirmationCode": newCode}})
            await mailService.sendMailConfirmation(user, true, newCode)
            res.sendStatus(204)
        } else {
            res.sendStatus(400)
        }
    }
)

authRouter.get('/me',
    authMiddlewareJwt,
    async (req: Request, res: Response) => {
        return res.json({
            email: req.context.user.accountData.email,
            login: req.context.user.accountData.login,
            userId: req.context.user.id
        })
    }
)

authRouter.post('/password-recovery',
    recoveryPasswordLimiter,
    body('email').isString().trim().matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
    inputValidationMiddlware,
    async (req: RequestWithBody<PasswordRecoveryInputModel>,res:Response) => {
        const {email} = req.body
        try {
            const user = await usersRepository.getUserByLoginOrEmail('', email)
            let code = v4()
            await mailService.sendRecoveryPasswordCode(user, false, code)
            await recoveryPasswordModelCollection.insertOne({userId:user.id,code})
            res.sendStatus(204)
        }
        catch (e){
            res.sendStatus(204)
        }

    }
)
authRouter.post('/new-password',
    newPasswordLimiter,
    body('newPassword').isString().trim().isLength({min: 6, max: 20}),
    body('recoveryCode').isString(),
    inputValidationMiddlware,
    async (req: RequestWithBody<NewRecoveryInputModel>,res:Response) => {
        const {newPassword,recoveryCode} = req.body
        const code =  await recoveryPasswordModelCollection.findOne({code:recoveryCode})
        if (code){
            const passwordSalt = await bcrypt.genSalt(10)
            const passwordHash = await usersService.generateHash(newPassword, passwordSalt)
            let updateStatus = await usersCollection.updateOne({id:code.userId},{$set:{'accountData.passwordSalt': passwordSalt,'accountData.password':passwordHash}})
            if (updateStatus.modifiedCount){
                res.sendStatus(204)
            }
            else{
                res.sendStatus(400)
            }
        }
        else{
            res.status(400).json(
                { errorsMessages: [{ message: 'Incorrect Recovery', field: "recoveryCode" }] }
            )
        }
    }
)
