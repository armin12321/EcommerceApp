"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicController = void 0;
//functions:
var product_1 = __importDefault(require("../models/product"));
var moment_1 = __importDefault(require("moment"));
var user_1 = __importDefault(require("../models/user"));
var path_1 = __importDefault(require("path"));
var mongodb_1 = require("mongodb");
var home = function (req, res) {
    //return all possible products sorted by the date
    product_1.default
        .find({})
        .sort({ date: -1 })
        .lean()
        .limit(18)
        .then(function (products) {
        //for each product, find difference in time of getting information, and setting product
        var dateToday = new Date().toISOString();
        var modifiedProducts = products.map(function (product) {
            var ago = findTime(dateToday, product.date);
            return {
                product: product,
                ago: ago
            };
        });
        res.json({
            success: true,
            msg: 'Served main page for our website.',
            products: modifiedProducts,
        });
    });
    var findTime = function (bigger, smaller) {
        var bigg = moment_1.default(bigger);
        var small = moment_1.default(smaller);
        var sec = bigg.diff(small, 'seconds');
        var min = bigg.diff(small, 'minutes');
        var hours = bigg.diff(small, 'hours');
        var days = bigg.diff(small, 'days');
        var months = bigg.diff(small, 'months');
        var years = bigg.diff(small, 'years');
        if (sec != 0 && sec < 60)
            return sec + " seconds ago";
        if (min != 0 && min < 60)
            return min + " minutes ago";
        if (hours != 0 && hours < 24)
            return hours + " hours ago";
        if (days != 0 && days < 30)
            return days + " days ago";
        if (months != 0 && months < 12)
            return months + " months ago";
        return years + " years ago";
    };
};
var about = function (req, res) {
    res.json({
        success: true,
        msg: 'Served about page for our website'
    });
};
var sellerInfo = function (req, res) {
    console.log(req.body._id);
    user_1.default
        .findById(req.body._id)
        .lean()
        .then(function (user) {
        console.log(user);
        var wrapper = {
            avatarName: user === null || user === void 0 ? void 0 : user.avatarName,
            username: user === null || user === void 0 ? void 0 : user.username,
            name: user === null || user === void 0 ? void 0 : user.name,
            surname: user === null || user === void 0 ? void 0 : user.surname,
            address: user === null || user === void 0 ? void 0 : user.address,
            email: user === null || user === void 0 ? void 0 : user.email,
            _id: user === null || user === void 0 ? void 0 : user._id
        };
        res.json({
            success: true,
            msg: 'Served seller info',
            user: wrapper
        });
    });
};
var productInfo = function (req, res) {
    res.json({});
};
var avatarImage = function (req, res) {
    console.log(req.body.avatarName);
    res.sendFile(path_1.default.join(__dirname, '..', 'uploads', 'images', 'avatars', req.body.avatarName));
};
var topProducts = function (req, res) {
    var id = new mongodb_1.ObjectID(req.body._id);
    product_1.default
        .find({ "user._id": id })
        .sort({ purchased: -1, date: -1 })
        .lean()
        .limit(10)
        .then(function (products) {
        var dateToday = new Date().toISOString();
        var modifiedProducts = products.map(function (product) {
            var ago = findTime(dateToday, product.date);
            return {
                product: product,
                ago: ago
            };
        });
        res.json({
            success: true,
            msg: 'Served main page for our website.',
            products: modifiedProducts,
        });
    });
    var findTime = function (bigger, smaller) {
        var bigg = moment_1.default(bigger);
        var small = moment_1.default(smaller);
        var sec = bigg.diff(small, 'seconds');
        var min = bigg.diff(small, 'minutes');
        var hours = bigg.diff(small, 'hours');
        var days = bigg.diff(small, 'days');
        var months = bigg.diff(small, 'months');
        var years = bigg.diff(small, 'years');
        if (sec != 0 && sec < 60)
            return sec + " seconds ago";
        if (min != 0 && min < 60)
            return min + " minutes ago";
        if (hours != 0 && hours < 24)
            return hours + " hours ago";
        if (days != 0 && days < 30)
            return days + " days ago";
        if (months != 0 && months < 12)
            return months + " months ago";
        return years + " years ago";
    };
};
//objects:
var publicController = {
    home: home,
    about: about,
    sellerInfo: sellerInfo,
    productInfo: productInfo,
    avatarImage: avatarImage,
    topProducts: topProducts
};
exports.publicController = publicController;
