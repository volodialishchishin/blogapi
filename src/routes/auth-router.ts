import {Response, Router} from "express";
import {RequestWithBody} from "../types/types";
import {usersService} from "../services/users-service";
import {body} from "express-validator";

export const authRouter = Router()

authRouter.post('/login',
    body('login').isString().trim().isLength({min: 3, max: 10}),
    body('password').isString().trim().isLength({min: 6, max: 20}),
    async (req: RequestWithBody<{ login: string, password: string }>, res: Response) => {
    const {login,password} = req.body
    const checkResult = await usersService.checkCredentials(login,password)
        if (checkResult){
            res.sendStatus(204)
        }
        else{
            res.sendStatus(401)
        }
    }
)
