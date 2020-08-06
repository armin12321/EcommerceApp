"use strict";
//functions
Object.defineProperty(exports, "__esModule", { value: true });
exports.rootController = void 0;
var root = function (req, res) {
    res.redirect('/public/home');
};
var rootController = {
    root: root
};
exports.rootController = rootController;
