//third party packages
import express, { Router } from 'express';

//controllers
import { userController } from '../controllers/user.controller';

const userRoutes: Router = express.Router();

userRoutes.post('/login', userController.login);

userRoutes.post('/register', userController.register);

export {userRoutes};