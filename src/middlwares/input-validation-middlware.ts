import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";
import {ErrorModel} from "../models/Error/Error";


export const inputValidationMiddlware = (req:Request,res:Response<ErrorModel>,next:NextFunction) =>{
    let errors = validationResult(req)
    if (!errors.isEmpty()){
        let errorsMes = [];
        let keys = Object.keys(errors.mapped());
        for (let i = 0; i<keys.length;i++){
            errorsMes.push({
                message:errors.mapped()[keys[i]].msg,
                field:errors.mapped()[keys[i]].param
            });
        }
        res.status(400).json({
            errorsMessages:errorsMes
        })
    }
    else{
        next()
    }
}
