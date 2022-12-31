import {NextFunction, Request, Response} from "express";
import {jwtService} from "../Application/jwt-service";
import {usersRepository} from "../DAL/users-repository";

export const authMiddlewareJwt = (async (req: Request, res: Response, next: NextFunction) => {
    const authType = req.headers.authorization?.split(' ')[0]
    const authToken = req.headers.authorization?.split(' ')[1]
    const authHeaderCheck = authToken && authType && authType === 'Bearer'
    if (!authHeaderCheck) {
        res.sendStatus(401)
        return
    }

    const userId = jwtService.getUserIdByToken(authToken)
    if (userId) {
        req.context = {user:await usersRepository.getUserById(userId)}
        if(req.context.user){
            return next()
        }

    }
    res.sendStatus(401)
    return




})
