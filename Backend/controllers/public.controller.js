"use strict";
//functions:
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicController = void 0;
var home = function (req, res) {
    res.json({
        msg: 'Served main page for our website.'
    });
};
var about = function (req, res) {
    res.json({
        msg: 'Served about page for our website'
    });
};
//objects:
var publicController = {
    home: home,
    about: about
};
exports.publicController = publicController;
