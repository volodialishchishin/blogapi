import {Response, Router} from "express";
import {
    RequestWithBody, RequestWithParams, RequestWithParamsAndBody,
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
import {commentsService} from "../services/comments-service";
import {CommentInputModel} from "../models/Comment/CommentInputModel";
import {authMiddlewareJwt} from "../middlwares/auth-middleware-jwt";
import {CommentViewModel} from "../models/Comment/CommentViewModel";

export const commentsRouter = Router()

commentsRouter.get('/:id', async (req: RequestWithParams<{ id: string }>, res: Response) => {
    return res.status(200).json(await commentsService.getComment(req.params.id))
})

commentsRouter.put('/:commentId',
    authMiddlewareJwt,
    body('content').isString().trim().isLength({min: 20, max: 300}),
    async (req: RequestWithParamsAndBody<{ id: string }, CommentInputModel>, res: Response) => {
        let comment = await commentsService.getComment(req.params.id)
        if (comment.userId !== req.context.user.id) {
            res.sendStatus(403)
        }
        if (!comment){
            res.sendStatus(404)
        }
        let updateStatus = await commentsService.updateComment(req.params.id, req.body.content)
        if (updateStatus){
            res.sendStatus(204)
        }
    })

commentsRouter.delete('/:commentId',
    authMiddlewareJwt,
    async (req:RequestWithParams<{ id:string }>,res:Response)=>{
    let comment = await commentsService.getComment(req.params.id)
    if (comment.userId !== req.context.user.id) {
        res.sendStatus(403)
    }
    if (!comment){
        res.sendStatus(404)
    }
    let deleteStatus = await commentsService.deleteComment(req.params.id)
    if (deleteStatus){
        res.sendStatus(204)
    }
})

