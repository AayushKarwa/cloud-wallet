import {Request, Response ,NextFunction } from 'express';
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from './constants';

export async function middleware(req:Request,res:Response,next:NextFunction){
    //@ts-ignore
    const token = req.cookies.accessToken;
    console.log(token)

    if(!token){
        res.status(404).json({
            message:"Token not provided"
        })
        return;
    }

    try {
        const decoded = jwt.verify(token,JWT_SECRET as string)
       
        req.user = decoded

        next();

    } catch (error) {
        res.status(500).json({
            message:"Invalid or expired token",
            error: error,
        })
    }
}
