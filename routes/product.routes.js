"use strict";
exports.__esModule = true;
exports.productRoutes = void 0;
//third party packages
var express_1 = require("express");
//controllers
var product_controller_1 = require("../controllers/product.controller");
//middleware
var auth_middleware_1 = require("../middlewares/auth.middleware");
var productRoutes = express_1["default"].Router();
exports.productRoutes = productRoutes;
productRoutes.post('/add', [auth_middleware_1.authMiddleware.verifyToken], product_controller_1.productController.add);
productRoutes.post('/productImage', product_controller_1.productController.sendProductPicture);
