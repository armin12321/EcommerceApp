"use strict";
//functions:
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
var login = function (req, res) {
    res.json({
        msg: 'Served login page',
        data: req.body
    });
};
var register = function (req, res) {
    res.json({
        msg: 'Served register page',
        data: req.body
    });
};
var userController = {
    register: register,
    login: login
};
exports.userController = userController;
