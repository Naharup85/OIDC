import { Router } from "express";
import * as authController from '../contoller/auth.contoller.js';
import {validate} from "../../../common/dto/validate.js";
import { registerDto } from "../DTO/registerDto.js";
import { loginDto } from "../DTO/loginDto.js";



const router=Router();


router.post('/signup',validate(registerDto),authController.register);

router.post('/login',validate(loginDto),authController.login);

export default router;