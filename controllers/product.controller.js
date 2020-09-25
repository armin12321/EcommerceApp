"use strict";
exports.__esModule = true;
exports.productController = void 0;
var path_1 = require("path");
var user_1 = require("../models/user");
var product_1 = require("../models/product");
var uuid_1 = require("uuid");
//functions:
var add = function (req, res) {
    var avatarName, upath, imageName;
    var pass = true;
    var uploaded;
    console.log(req.body.name);
    console.log(req.files.file);
    var images = req.files.file;
    var user = new user_1["default"](JSON.parse(req.body.user));
    var product = new product_1["default"]({
        name: req.body.name[1],
        user: user,
        price: req.body.price,
        available: req.body.available,
        condition: req.body.condition,
        purchased: 0,
        date: new Date().toISOString(),
        images: [],
        description: req.body.description
    });
    for (var i = 0; i < images.length; i++) {
        product['images'].push(product.name + uuid_1.v4() + path_1["default"].extname(images[i].name));
    }
    product.save().then(function (product) {
        for (var i = 0; i < images.length; i++) {
            imageName = product.images[i];
            // imageName = product.id + '-' + i.toString() + path.extname(images[i].name); Ima i ova varijanta davanja imena.
            upath = path_1["default"].join(__dirname, '..', '/uploads/images/products', imageName);
            images[i].mv(upath, function (err) {
                if (err) {
                    return res.json({
                        success: false,
                        msg: 'Something went wrong. Try again later'
                    });
                }
            });
        }
    })["catch"](function (err) {
        console.log(err);
    });
    return res.json({
        success: true,
        msg: 'Product added successfully'
    });
};
var sendProductPicture = function (req, res) {
    console.log(req.body.url);
    var pathToPicture = path_1["default"].join(__dirname, '..', 'uploads/images/products', req.body.url);
    res.sendFile(pathToPicture);
};
var productController = {
    add: add,
    sendProductPicture: sendProductPicture
};
exports.productController = productController;
