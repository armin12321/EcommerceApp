import express, { Router } from 'express';
import { userController } from '../controllers/user.controller';

const userRoutes: Router = express.Router();

userRoutes.get('/login', userController.login);

userRoutes.get('/register', userController.register);

export {userRoutes};