"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rootRoutes = void 0;
var express_1 = __importDefault(require("express"));
var root_controller_1 = require("../controllers/root.controller");
var rootRoutes = express_1.default.Router();
exports.rootRoutes = rootRoutes;
rootRoutes.get('/', root_controller_1.rootController.root);
