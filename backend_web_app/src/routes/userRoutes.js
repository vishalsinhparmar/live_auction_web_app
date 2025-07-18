import express from 'express';
import { loginUser, UserSignIn, UserSignUp } from '../controller/user.controller.js';
import { verifyUser } from '../middleware/verifyUser.js';

const userRoutes = express.Router();

userRoutes.post('/signUp',UserSignUp);
userRoutes.post('/signIn',UserSignIn);
userRoutes.get('/loginUser',verifyUser,loginUser);


export default userRoutes;
