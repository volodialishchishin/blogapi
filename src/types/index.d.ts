import {UserModel} from "../models/User/User";
import {UserViewModel} from "../models/User/UserViewModel";

declare global{
    declare namespace Express{
        export interface Request{
            context:{
                user:UserModel
            }
        }
    }
}
