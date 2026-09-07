import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import cors from "cors";

import ApiResponse from './common/utils/apiresonse.js';
import authRouter from './module/auth/routes/auth.router.js'

export const createServerApplication=()=>{
    const app=express();

    app.use(express.static('public'))

    app.use(cors({origin:"*",credentials:true}))

    app.use(express.json());

    app.use(express.urlencoded({extended:true}));

    app.get('/',(req:Request,res:Response)=>{
        res.send('Hello World');
    })
    app.get('/health',(req:Request,res:Response)=>{
        res.send('OK');
    });

    app.get('/.well-known/openid-configuration',(_:Request,res:Response)=>{
        ApiResponse.ok(res,{
            issuer: process.env.BASE_URL,
            authorization_endpoint: `${process.env.BASE_URL}/authenticate`,
            token_endpoint: `${process.env.BASE_URL}/token`,
            userinfo_endpoint: `${process.env.BASE_URL}/userinfo`,
            jwks_uri: `${process.env.BASE_URL}/jwks`,
        });
    });

    

    app.get('/authenticate',(_:Request,res:Response)=>{
        res.sendFile(path.resolve("public","authenticate.html"))
    })

    

    app.use('/api/auth',authRouter);
    

    return app;
}