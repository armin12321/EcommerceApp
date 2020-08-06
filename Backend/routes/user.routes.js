"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
var express_1 = __importDefault(require("express"));
var user_controller_1 = require("../controllers/user.controller");
var userRoutes = express_1.default.Router();
exports.userRoutes = userRoutes;
userRoutes.get('/login', user_controller_1.userController.login);
userRoutes.get('/register', user_controller_1.userController.register);
