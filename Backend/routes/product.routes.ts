//third party packages
import express, { Router } from 'express';

//controllers
import { productController } from '../controllers/product.controller';

//middleware
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateMiddleware } from '../middlewares/validate.middleware';

const productRoutes: Router = express.Router();

productRoutes.post('/add', [authMiddleware.verifyToken], productController.add);

productRoutes.post('/productImage', [authMiddleware.verifyToken], productController.sendProductPicture);

export {productRoutes};