//third party packages
import express from 'express';
//controller
import { publicController } from '../controllers/public.controller';
const publicRoutes = express.Router();
publicRoutes.get('/home', publicController.home);
publicRoutes.get('/about', publicController.about);
publicRoutes.post('/sellerInfo', publicController.sellerInfo);
publicRoutes.post('/avatarImage', publicController.avatarImage);
publicRoutes.post('/topProducts', publicController.topProducts);
export { publicRoutes };
