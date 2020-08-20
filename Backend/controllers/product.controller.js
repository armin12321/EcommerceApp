"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productController = void 0;
var path_1 = __importDefault(require("path"));
var user_1 = __importDefault(require("../models/user"));
var product_1 = __importDefault(require("../models/product"));
var uuid_1 = require("uuid");
//functions:
var add = function (req, res) {
    var avatarName, upath, imageName;
    var pass = true;
    var uploaded;
    var images = req.files.file;
    var user = new user_1.default({
        username: req.body.username,
        type: req.body.type,
    });
    var product = new product_1.default({
        name: req.body.name,
        user: user,
        price: req.body.price,
        available: req.body.available,
        condition: req.body.condition,
        purchased: 0,
        date: new Date(),
        images: [],
        description: req.body.description
    });
    for (var i = 0; i < images.length; i++) {
        product['images'].push(product.name + uuid_1.v4() + path_1.default.extname(images[i].name));
    }
    product.save().then(function (product) {
        for (var i = 0; i < images.length; i++) {
            imageName = product.name + uuid_1.v4() + path_1.default.extname(images[i].name);
            // imageName = product.id + '-' + i.toString() + path.extname(images[i].name); Ima i ova varijanta davanja imena.
            upath = path_1.default.join(__dirname, '..', '/uploads/images/products', imageName);
            images[i].mv(upath, function (err) {
                if (err) {
                    return res.json({
                        success: false,
                        msg: 'Something went wrong. Try again later'
                    });
                }
            });
        }
    });
    return res.json({
        success: true,
        msg: 'Product added successfully'
    });
};
var productController = {
    add: add
};
exports.productController = productController;
