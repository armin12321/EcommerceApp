//third party packages
import express, { Router } from 'express';

//middleware
import { authMiddleware } from '../middlewares/auth.middleware';

//controller
import { infoController } from '../controllers/info.controller';

const infoRoutes: Router = express.Router();

infoRoutes.get('/newMessages', [authMiddleware.verifyToken], infoController.newMessages);

infoRoutes.get('/recentChats', [authMiddleware.verifyToken], infoController.recentChats);

infoRoutes.get('/myOrders', [authMiddleware.verifyToken], infoController.myOrders); //later

infoRoutes.post('/changeOnlineStatus',[authMiddleware.verifyToken] ,infoController.changeOnlineStatus);

export {infoRoutes};