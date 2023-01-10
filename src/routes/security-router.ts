import {Request, Response, Router} from "express";
import {authMiddlewareJwt} from "../middlwares/auth-middleware-jwt";
import {securityService} from "../services/security-service";

export const securityRouter = Router()

securityRouter.get('/devices',
    async (req: Request, res: Response) => {
        const {refreshToken} = req.cookies;
        if (!refreshToken){
            res.sendStatus(401)
        }
        let sessions = await securityService.getSessions(refreshToken)
        res.status(200).json(sessions)
    })

securityRouter.delete('/devices',
    authMiddlewareJwt,
    async (req: Request, res: Response) => {
        const {refreshToken} = req.cookies;
        if (!refreshToken){
            res.sendStatus(401)
        }
        let deleteResult = await securityService.deleteSessions(refreshToken)
        if (deleteResult.acknowledged){
            res.sendStatus(204)
        }

    })

securityRouter.delete('/devices/:id',
    authMiddlewareJwt,
    async (req: Request, res: Response) => {
        const {refreshToken} = req.cookies;
        if (!refreshToken){
            res.sendStatus(401)
        }
        let deleteResult = await securityService.deleteSession(refreshToken, req.body.id)
        if (deleteResult.acknowledged){
            res.sendStatus(204)
        }
    })
