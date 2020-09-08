//third party packages
import express, { Router } from 'express';

//controller
import { publicController } from '../controllers/public.controller';

const publicRoutes: Router = express.Router();

publicRoutes.get('/home', publicController.home);

publicRoutes.get('/about', publicController.about);

publicRoutes.post('/sellerInfo', publicController.sellerInfo);

publicRoutes.post('/avatarImage', publicController.avatarImage);

export {publicRoutes};
