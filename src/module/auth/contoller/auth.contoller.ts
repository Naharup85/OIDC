import type{Request,Response} from 'express';
import * as authService from '../services/auth.service.js';
import ApiResponse from '../../../common/utils/apiresonse.js';

const register=async(req:Request,res:Response)=>{
    const result=await authService.register(req.body);
    ApiResponse.created(res,{...result, ...req.body},'User registered successfully');
}

const login=async(req:Request,res:Response)=>{
    
}


const logout=async(req:Request,res:Response)=>{
    
}

const refreshToken=async(req:Request,res:Response)=>{
    
}

export {
    register,
    login,
    logout,
    refreshToken
}