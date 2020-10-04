"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRoutes = void 0;
//third party packages
var express_1 = __importDefault(require("express"));
//controllers
var product_controller_1 = require("../controllers/product.controller");
//middleware
var auth_middleware_1 = require("../middlewares/auth.middleware");
var productRoutes = express_1.default.Router();
exports.productRoutes = productRoutes;
productRoutes.post('/add', [auth_middleware_1.authMiddleware.verifyToken], product_controller_1.productController.add);
productRoutes.post('/productImage', product_controller_1.productController.sendProductPicture);
productRoutes.post('/category', product_controller_1.productController.category);
productRoutes.post('/getProduct', product_controller_1.productController.getProduct);
productRoutes.post('/delete', [auth_middleware_1.authMiddleware.verifyToken], product_controller_1.productController.deleteProduct);
productRoutes.post('/update', [auth_middleware_1.authMiddleware.verifyToken], product_controller_1.productController.updateProduct);
