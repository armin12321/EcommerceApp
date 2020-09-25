//third party packages
import express from 'express';
//controllers
import { productController } from '../controllers/product.controller';
//middleware
import { authMiddleware } from '../middlewares/auth.middleware';
const productRoutes = express.Router();
productRoutes.post('/add', [authMiddleware.verifyToken], productController.add);
productRoutes.post('/productImage', productController.sendProductPicture);
export { productRoutes };
