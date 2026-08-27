import type{Request,Response} from 'express';
import * as authService from '../services/auth.service.js';
import ApiResponse from '../../../common/utils/apiresonse.js';

const register=async(req:Request,res:Response)=>{
    const shortCode=await authService.register(req.body);
    ApiResponse.redirect(res,`${req.body.redirectUri}?code=${shortCode}`);
}

const login=async(req:Request,res:Response)=>{
    const shortCode=await authService.login(req.body);
    ApiResponse.redirect(res,`${req.body.redirectUri}?code=${shortCode}`);
}


const logout=async(req:Request,res:Response)=>{
    await authService.logout(req.body.userId);
    ApiResponse.ok(res,{},"Logout success");
}

const refresh=async(req:Request,res:Response)=>{
    const shortCode=await authService.refresh(req.body);
    ApiResponse.ok(res,shortCode);
}

export {
    register,
    login,
    logout,
    refresh
}