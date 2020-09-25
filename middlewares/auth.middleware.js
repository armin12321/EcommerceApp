"use strict";
exports.__esModule = true;
exports.authMiddleware = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
var server_config_1 = require("../configs/server.config");
var verifyToken = function (req, res, next) {
    var token = req.headers["x-access-token"];
    if (!token) {
        return res.json({
            msg: 'not authorized',
            success: false
        });
    }
    jsonwebtoken_1["default"].verify(token, server_config_1.serverConfig.SECRET, function (err, decoded) {
        if (err) {
            return res.json({
                msg: 'not authorized',
                success: false
            });
        }
        req.username = decoded.username;
        req.user_id = decoded._id;
        req.user_type = decoded.type;
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
