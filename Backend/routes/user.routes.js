"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
//third party packages
var express_1 = __importDefault(require("express"));
//controllers
var user_controller_1 = require("../controllers/user.controller");
//middleware
var auth_middleware_1 = require("../middlewares/auth.middleware");
var userRoutes = express_1.default.Router();
exports.userRoutes = userRoutes;
userRoutes.post('/login', user_controller_1.userController.login);
userRoutes.post('/register', user_controller_1.userController.register);
userRoutes.get('/profile', [auth_middleware_1.authMiddleware.verifyToken], user_controller_1.userController.profile);
userRoutes.get('/cart', [auth_middleware_1.authMiddleware.verifyToken], user_controller_1.userController.cart);
