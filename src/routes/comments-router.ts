import {Response, Router} from "express";
import {
    RequestWithBody, RequestWithParams, RequestWithParamsAndBody,
    RequestWithQuery, UserQueryParams,
} from "../types/types";
import {body, query} from "express-validator";
import {inputValidationMiddlware} from "../middlwares/input-validation-middlware";
import {commentsService} from "../services/comments-service";
import {CommentInputModel} from "../models/Comment/CommentInputModel";
import {authMiddlewareJwt} from "../middlwares/auth-middleware-jwt";
import {LikeInfoViewModelValues} from "../models/LikeInfo/LikeInfoViewModel";
import {commentsRepository} from "../DAL/comments-repository";
import {jwtService} from "../Application/jwt-service";

export const commentsRouter = Router()

commentsRouter.get('/:id', async (req: RequestWithParams<{ id: string }>, res: Response) => {
    try {
        const authToken = req.headers.authorization?.split(' ')[1] || ''
        const user = jwtService.getUserIdByToken(authToken)

        let result = await commentsRepository.getCommentById(req.params.id, user)
        result ? res.status(200).json(result) : res.sendStatus(404)
    }
    catch (e) {
        console.log('e',e)
    }
})

commentsRouter.put('/:commentId',
    authMiddlewareJwt,
    body('content').isString().trim().isLength({min: 20, max: 300}),
    inputValidationMiddlware,
    async (req: RequestWithParamsAndBody<{ commentId: string }, CommentInputModel>, res: Response) => {

        let comment = await commentsService.getComment(req.params.commentId, req.context.user.id)
        if (!comment) {
            res.sendStatus(404)
            return
        }
        if (comment.commentatorInfo.userId !== req.context.user.id) {
            res.sendStatus(403)
            return
        }
        let updateStatus = await commentsService.updateComment(req.params.commentId, req.body.content)
        if (updateStatus) {
            res.sendStatus(204)
            return
        }
    })

commentsRouter.delete('/:commentId',
    authMiddlewareJwt,
    inputValidationMiddlware,
    async (req: RequestWithParams<{ commentId: string }>, res: Response) => {

        let comment = await commentsService.getComment(req.params.commentId, req.context.user.id)
        if (!comment) {
            res.sendStatus(404)
            return
        }
        if (comment.commentatorInfo.userId !== req.context.user.id) {
            res.sendStatus(403)
            return
        }

        let deleteStatus = await commentsService.deleteComment(req.params.commentId)
        if (deleteStatus) {
            res.sendStatus(204)
            return
        }
    })

commentsRouter.put('/:commentId/like-status',
    body('likeStatus').isString().isIn(['Like','None','Dislike']),
    authMiddlewareJwt,
    inputValidationMiddlware,
    async (req: RequestWithParamsAndBody<{commentId:string},{ likeStatus: LikeInfoViewModelValues }>, res: Response) => {
        const { likeStatus } = req.body

        let result = await commentsRepository.updateLikeStatus(likeStatus, req?.context?.user?.id, req.params.commentId)
        if (result){
            res.sendStatus(204)
        }else{
            res.sendStatus(404)
        }

    })
