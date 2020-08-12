"use strict";
//functions:
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicController = void 0;
var home = function (req, res) {
    var test = req.headers['x-access-token'];
    console.log(test); //to see whether i really get a token in every route with interceptor.
    res.json({
        success: true,
        msg: 'Served main page for our website.'
    });
};
var about = function (req, res) {
    res.json({
        success: true,
        msg: 'Served about page for our website'
    });
};
//objects:
var publicController = {
    home: home,
    about: about
};
exports.publicController = publicController;
