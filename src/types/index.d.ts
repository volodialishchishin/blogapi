import {UserModel} from "../models/User/User";
import {UserViewModel} from "../models/User/UserViewModel";
import * as jwt from "jsonwebtoken";
declare global{
    declare namespace Express{
        export interface Request{
            context:{
                user:UserModel
            }
        }
    }
}
declare module 'jsonwebtoken' {
    export interface UserIDJwtPayload extends jwt.JwtPayload {
        userId: string
    }
}
