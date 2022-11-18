import {Request, Response, Router} from "express";
import {RequestWithBody} from "../types/types";
import {usersService} from "../services/users-service";
import {body} from "express-validator";
import {LoginInputModel} from "../models/Login/LoginInputModel";
import {jwtService} from "../Application/jwt-service";
import {authMiddlewareJwt} from "../middlwares/auth-middleware-jwt";
import {usersRepository} from "../DAL/users-repository";

export const authRouter = Router()

authRouter.post('/login',
    body('login').optional().isString().trim().isLength({min: 3, max: 10}),
    body('email').optional().isString().trim().isLength({min: 3, max: 10}),
    body('password').isString().trim().isLength({min: 6, max: 20}),
    async (req: RequestWithBody<LoginInputModel>, res: Response) => {
        const {login='', password='',email=''} = req.body
        const user = await usersService.checkCredentials(login, password,email)
        console.log('fsdfd',user)
        if (user) {
            const token = jwtService.createJWT(user)
            res.status(200).json({accessToken:token})
        } else {
            res.sendStatus(401)
        }
    }
)
authRouter.get('/me',
    authMiddlewareJwt,
    async (req: Request, res: Response) => {
        const user = req.context.user?.id ? await usersRepository.getUserById(req.context.user?.id ) : null
        if (user) {
            res.status(200).json({
                email:user.email,
                login:user.login,
                userId:user.id
            })
        } else {
            res.sendStatus(401)
        }
    }
)
