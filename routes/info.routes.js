"use strict";
exports.__esModule = true;
exports.infoRoutes = void 0;
//third party packages
var express_1 = require("express");
//middleware
var auth_middleware_1 = require("../middlewares/auth.middleware");
//controller
var info_controller_1 = require("../controllers/info.controller");
var infoRoutes = express_1["default"].Router();
exports.infoRoutes = infoRoutes;
infoRoutes.get('/newMessages', [auth_middleware_1.authMiddleware.verifyToken], info_controller_1.infoController.newMessages);
infoRoutes.get('/recentChats', [auth_middleware_1.authMiddleware.verifyToken], info_controller_1.infoController.recentChats);
infoRoutes.get('/myOrders', [auth_middleware_1.authMiddleware.verifyToken], info_controller_1.infoController.myOrders); //later
infoRoutes.post('/changeOnlineStatus', [auth_middleware_1.authMiddleware.verifyToken], info_controller_1.infoController.changeOnlineStatus);
