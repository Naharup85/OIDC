import type { Request, Response ,NextFunction} from "express";
import ApiError from "../../../common/utils/apiError.js";
import * as jwtUtils from "../../../common/utils/jwt-utility.js";
import { db } from "../../../index.js";
import { usersTable } from "../../../db/schema.js";
import { eq } from "drizzle-orm";



const authenticate=async (req:Request,res:Response,next:NextFunction)=>{
    
    let token;
    if(!req.headers.authorization  || !req.headers.authorization.startsWith('Bearer ')){
        throw ApiError.unauthorized("You are not authorized to perform this action");
    }

    token=req.headers.authorization.split(' ')[1];
    
    const decodedToken=jwtUtils.verifyAccessToken(token!);

   const [user]=await db.select().from(usersTable)
   .where(eq(usersTable.id,decodedToken.id)).limit(1)
   
   if(!user){
    throw ApiError.unauthorized("You are not authorized to perform this action");
   }
   req.user=user;
   
    next();
}

export {authenticate}