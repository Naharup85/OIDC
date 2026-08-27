import { Router } from "express";
import * as authController from '../contoller/auth.contoller.js';
import {validate} from "../../../common/dto/validate.js";
import { registerDto } from "../DTO/registerDto.js";
import { loginDto } from "../DTO/loginDto.js";
import { authenticate } from "../middleware/auth.middleware.js";



const router=Router();


router.post('/signup',validate(registerDto),authController.register);

router.post('/login',validate(loginDto),authController.login);

router.post('/refresh',authenticate,authController.refresh);

router.post('/logout',authenticate,authController.logout);



export default router;