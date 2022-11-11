import {NextFunction, Request, Response} from "express";

export const authMiddleware = ((req:Request, res:Response, next:NextFunction) => {
    const auth = {login: 'admin', password: 'qwerty'}
    const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':')
    if ((login && password && login === auth.login && password === auth.password) && (req.headers.authorization && req.headers.authorization.split(' ')[0]=== 'Basic')) {
        console.log(password,login,'ues')
        return next()
    }
    console.log(password,login,'no')
    res.sendStatus(401)

})
