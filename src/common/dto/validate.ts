import {z} from 'zod';
import type {Request,Response,NextFunction} from 'express';
import ApiError from '../utils/apiError.js';

export function validate(schema:z.ZodType<any>){
    return async (req:Request,res:Response,next:NextFunction)=>{
        try{
            const result=await schema.safeParseAsync(req.body);
            if(!result.success){
                console.log(result.error.issues);
                throw ApiError.badRequest(JSON.stringify(result.error.issues));
            }
            req.body=result.data;
            next();
        }catch(error){
            throw ApiError.badRequest('Invalid request');
        }
    }
}