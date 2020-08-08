"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var server_config_1 = require("../configs/server.config");
var verifyToken = function (req, res, next) {
    var token = req.headers["x-access-token"];
    if (!token) {
        return res.json({
            msg: 'no token provided in headers'
        });
    }
    jsonwebtoken_1.default.verify(token, server_config_1.serverConfig.SECRET, function (err, decoded) {
        if (err) {
            return res.json({
                msg: 'you are not authorized to see content of this page!'
            });
        }
        req.username = decoded.username;
        req.password = decoded.password;
        req.email = decoded.email; //provide information that you got from decoded token.      
        next();
    });
};
var addHeaders = function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
    next();
};
var authMiddleware = {
    verifyToken: verifyToken,
    addHeaders: addHeaders
};
exports.authMiddleware = authMiddleware;
