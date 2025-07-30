import express from 'express';
import { loginUser, UserSignIn, UserSignUp } from '../controller/user.controller.js';
import { verifyUser } from '../middleware/verifyUser.js';
import { rateLimittingAuth } from '../middleware/rateLimiter.js';

const userRoutes = express.Router();

userRoutes.post('/signUp',rateLimittingAuth,UserSignUp);
userRoutes.post('/signIn',rateLimittingAuth,UserSignIn);
userRoutes.get('/loginUser',verifyUser,loginUser);


export default userRoutes;
