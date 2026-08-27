import bcrypt from "bcrypt"

import ApiError from "../../../common/utils/apiError.js";
import type { RegisterDto } from "../DTO/registerDto.js";
import type { LoginDto } from "../DTO/loginDto.js";
import {db} from "../../../index.js";
import {usersTable,clientsTable,authorizationCodesTable} from "../../../db/schema.js";
import { eq } from "drizzle-orm";
import * as jwtutil from "../../../common/utils/jwt-utility.js";

const register=async({clientId,firstName,lastName,email,password}:RegisterDto)=>{


    const client =await db.select().from(clientsTable).where(eq(clientsTable.id,clientId)).limit(1);
    if(client.length===0){
        throw ApiError.badRequest('Client not found');
    }


    const existinfUser=await db.select().from(usersTable).where(eq(usersTable.email,email)).limit(1)

    if(existinfUser.length>0){
        throw ApiError.badRequest('User already exists');
    }

    const hashedPassword=await bcrypt.hash(password,10);
    
    const userId=await db.insert(usersTable).values({
        firstName,
        lastName,
        email,
        password:hashedPassword,
    }).returning({
        id:usersTable.id
    })

    const shortCode=jwtutil.generateTokens();
    const hashedShortCode=jwtutil.generateHashedTokens(shortCode);
    await db.insert(authorizationCodesTable).values({
        code:hashedShortCode,
        codeExpiry:new Date(Date.now()+60*60*1000),
        userId:userId[0]?.id
    })

    return shortCode;

}



const login=async({clientId,email,password}:LoginDto)=>{
    
    const client =await db.select().from(clientsTable).where(eq(clientsTable.id,clientId)).limit(1);
    if(client.length===0){
        throw ApiError.badRequest('Client not found');
    }
    
    const user=await db.select().from(usersTable).where(eq(usersTable.email,email)).limit(1)
    

    if(!user || user.length===0){
        throw ApiError.badRequest('User not found');
    }
    
    const isMatch=await bcrypt.compare(password,user[0]?.password!);
    
    if(!isMatch){
        throw ApiError.badRequest('Email or Password is not correct');
    }

    
    await db.update(usersTable).set({
        refreshToken:jwtutil.genrateRefreshToken({id:user[0]?.id!}),
        
    }).where(eq(usersTable.id,user[0]?.id!));

    const shortCode=jwtutil.generateTokens();
    const hashedShortCode=jwtutil.generateHashedTokens(shortCode);
    await db.insert(authorizationCodesTable).values({
        code:hashedShortCode,
        codeExpiry:new Date(Date.now()+60*60*1000),
        userId:user[0]?.id
    })
    return shortCode;
    
}

const logout=async(userId:string)=>{
    await db.update(usersTable).set({
        refreshToken:null,
    }).where(eq(usersTable.id,userId))
}


const refresh=async({user_id,client_id}:any)=>{
    
    const client =await db.select().from(clientsTable).where(eq(clientsTable.id,client_id)).limit(1);
    if(client.length===0){
        throw ApiError.badRequest('Client not found');
    }
    const user=await db.select().from(usersTable).where(eq(usersTable.id,user_id)).limit(1)
    
    if(!user || user.length===0){
        throw ApiError.badRequest('User not found');
    }
    
    const refreshToken=jwtutil.genrateRefreshToken({id:user[0]?.id!});
   
    const hashedRefreshToken=jwtutil.generateHashedTokens(refreshToken);
    await db.update(usersTable).set({
        refreshToken:hashedRefreshToken,
    }).where(eq(usersTable.id,user[0]?.id!));
    const shortCode=jwtutil.generateTokens();
    const hashedShortCode=jwtutil.generateHashedTokens(shortCode);
    await db.insert(authorizationCodesTable).values({
        code:hashedShortCode,
        codeExpiry:new Date(Date.now()+60*60*1000),
        userId:user[0]?.id
    })
    return shortCode;

}

export {
    register,
    login,
    logout,
    refresh
}