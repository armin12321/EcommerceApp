//third party packages
import express, { Router } from 'express';

//controllers
import { userController } from '../controllers/user.controller';

//middleware
import { authMiddleware } from '../middlewares/auth.middleware';

const userRoutes: Router = express.Router();

userRoutes.post('/login', userController.login);

userRoutes.post('/register', userController.register);

userRoutes.get('/profile', [authMiddleware.verifyToken], userController.profile);

userRoutes.get('/cart', [authMiddleware.verifyToken], userController.cart);

export {userRoutes};