import {Request, Response, Router} from "express";
import {authMiddlewareJwt} from "../middlwares/auth-middleware-jwt";
import {securityService} from "../services/security-service";
import {securityRepository} from "../DAL/security-repository";
import jwt from "jsonwebtoken";

export const securityRouter = Router()

securityRouter.get('/devices',
    async (req: Request, res: Response) => {
        try {
            const {refreshToken} = req.cookies;
            let sessions = await securityService.getSessions(refreshToken)
            res.status(200).json(sessions)
        } catch (e) {
            res.sendStatus(401)
        }

    })

securityRouter.delete('/devices',
    async (req: Request, res: Response) => {
        const {refreshToken} = req.cookies;
        try {
            let deleteResult = await securityService.deleteSessions(refreshToken)
            if (deleteResult.deletedCount) {
                res.sendStatus(204)
            } else {
                res.sendStatus(401)
            }

        } catch (e) {
            res.sendStatus(401)
        }

    })

securityRouter.delete('/devices/:id',
    async (req: Request, res: Response) => {
        const {refreshToken} = req.cookies;
        try {
            const {user} = <jwt.UserIDJwtPayload>jwt.verify(refreshToken, process.env.SECRET || 'Ok')
            await securityRepository.getSession(user, req.body.id)
        } catch (e) {
            return res.sendStatus(403)
        }
        try {
            let deleteResult = await securityService.deleteSession(refreshToken, req.body.id)
            if (deleteResult.deletedCount) {
                res.sendStatus(204)
            } else {
                res.sendStatus(404)
            }
        } catch (e) {
            res.sendStatus(401)
        }

    })
