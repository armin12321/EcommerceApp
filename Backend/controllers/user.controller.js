"use strict";
//functions:
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
var login = function (req, res) {
    res.send({
        msg: 'Served login page'
    });
};
var register = function (req, res) {
    res.send({
        msg: 'Served register page'
    });
};
var userController = {
    register: register,
    login: login
};
exports.userController = userController;
