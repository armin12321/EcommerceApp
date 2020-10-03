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
var chat_controller_1 = require("../controllers/chat.controller");
//middleware
var auth_middleware_1 = require("../middlewares/auth.middleware");
var validate_middleware_1 = require("../middlewares/validate.middleware");
var userRoutes = express_1.default.Router();
exports.userRoutes = userRoutes;
userRoutes.post('/login', user_controller_1.userController.login);
userRoutes.post('/register', [validate_middleware_1.validateMiddleware.verifyCredentials], user_controller_1.userController.register);
userRoutes.get('/profile', [auth_middleware_1.authMiddleware.verifyToken], user_controller_1.userController.profile);
userRoutes.get('/cart', [auth_middleware_1.authMiddleware.verifyToken], user_controller_1.userController.cart);
userRoutes.get('/products', [auth_middleware_1.authMiddleware.verifyToken], user_controller_1.userController.products);
userRoutes.post('/chat/loadMessages', [auth_middleware_1.authMiddleware.verifyToken], chat_controller_1.chatController.loadMessages);
userRoutes.post('/chat/sendMessage', [auth_middleware_1.authMiddleware.verifyToken], chat_controller_1.chatController.saveMessage);
userRoutes.post('/chat/getNewMessages', [auth_middleware_1.authMiddleware.verifyToken], chat_controller_1.chatController.getNewMessages);
userRoutes.get('/notifications', [auth_middleware_1.authMiddleware.verifyToken], chat_controller_1.chatController.notifications);
userRoutes.post('/getByID', [auth_middleware_1.authMiddleware.verifyToken], user_controller_1.userController.getByID);
userRoutes.post('/addToCart', [auth_middleware_1.authMiddleware.verifyToken], user_controller_1.userController.addToCart);
userRoutes.post('/deleteFromCart', [auth_middleware_1.authMiddleware.verifyToken], user_controller_1.userController.deleteFromCart);
userRoutes.post('/updateCartQuantity', [auth_middleware_1.authMiddleware.verifyToken], user_controller_1.userController.updateCartQuantity);
userRoutes.put('/updateInfo', [auth_middleware_1.authMiddleware.verifyToken], user_controller_1.userController.updateInfo);
