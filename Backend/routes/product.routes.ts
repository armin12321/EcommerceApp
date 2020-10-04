//third party packages
import express, { Router } from 'express';

//controllers
import { productController } from '../controllers/product.controller';

//middleware
import { authMiddleware } from '../middlewares/auth.middleware';

const productRoutes: Router = express.Router();

productRoutes.post('/add', [authMiddleware.verifyToken], productController.add);

productRoutes.post('/productImage', productController.sendProductPicture);

productRoutes.post('/category', productController.category);

productRoutes.post('/getProduct', productController.getProduct);

productRoutes.post('/delete', [authMiddleware.verifyToken], productController.deleteProduct);

productRoutes.post('/update', [authMiddleware.verifyToken], productController.updateProduct);

export {productRoutes};