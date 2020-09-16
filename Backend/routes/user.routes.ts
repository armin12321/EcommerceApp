//third party packages
import express, { Router } from 'express';

//controllers
import { userController } from '../controllers/user.controller';
import { chatController } from '../controllers/chat.controller';

//middleware
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateMiddleware } from '../middlewares/validate.middleware';

const userRoutes: Router = express.Router();

userRoutes.post('/login', userController.login);

userRoutes.post('/register', [validateMiddleware.verifyCredentials], userController.register);

userRoutes.get('/profile', [authMiddleware.verifyToken], userController.profile);

userRoutes.get('/cart', [authMiddleware.verifyToken], userController.cart);

userRoutes.get('/products', [authMiddleware.verifyToken], userController.products);

userRoutes.post('/chat/loadMessages', [authMiddleware.verifyToken], chatController.loadMessages);

userRoutes.post('/chat/sendMessage', [authMiddleware.verifyToken], chatController.saveMessage);

userRoutes.post('/chat/getNewMessages', [authMiddleware.verifyToken], chatController.getNewMessages);

userRoutes.get('/notifications', [authMiddleware.verifyToken], chatController.notifications);

export {userRoutes};