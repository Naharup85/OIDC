import bcrypt from "bcrypt"

import ApiError from "../../../common/utils/apiError.js";
import type { RegisterDto } from "../DTO/registerDto.js";
import type { LoginDto } from "../DTO/loginDto.js";
import {db} from "../../../index.js";
import {usersTable} from "../../../db/schema.js";
import { eq } from "drizzle-orm";

const register=async({firstName,lastName,email,password}:RegisterDto)=>{
    const existinfUser=await db.select().from(usersTable).where(eq(usersTable.email,email)).limit(1)

    if(existinfUser.length>0){
        throw ApiError.badRequest('User already exists');
    }

    const hashedPassword=await bcrypt.hash(password,10);
    
    const [user]=await db.insert(usersTable).values({
        firstName,
        lastName,
        email,
        password:hashedPassword,
    }).returning({id:usersTable.id})

    return {user}    
}



const login=async({email,password}:LoginDto)=>{
    const user=await db.select().from(usersTable).where(eq(usersTable.email,email)).limit(1);
    
    if(user.length===0){
        throw ApiError.badRequest('User not found');
    }
    
    const isMatch=await bcrypt.compare(password,user[0]?.password);
    
    if(!isMatch){
        throw ApiError.badRequest('Invalid password');
    }

    

    
    
}


export {
    register,
    login
}