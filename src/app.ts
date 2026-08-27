import express from 'express';
import type { Request, Response } from 'express';
import ApiResponse from './common/utils/apiresonse.js';

export const createServerApplication=()=>{
    const app=express();

    app.get('/health',(req:Request,res:Response)=>{
        res.send('OK');
    });

    app.get('/.well-known/openid-configuration',(_:Request,res:Response)=>{
        ApiResponse.ok(res,{
            issuer: process.env.BASE_URL,
            authorization_endpoint: `${process.env.BASE_URL}/auth`,
            token_endpoint: `${process.env.BASE_URL}/token`,
            userinfo_endpoint: `${process.env.BASE_URL}/userinfo`,
            jwks_uri: `${process.env.BASE_URL}/jwks`,
        });
    });

    

    app.get('/authorize',(_:Request,res:Response)=>{
        ApiResponse.ok(res,`${process.env.BASE_URL}/auth`)
    })

    
    

    return app;
}