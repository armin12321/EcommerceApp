"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicController = void 0;
//functions:
var product_1 = __importDefault(require("../models/product"));
var moment_1 = __importDefault(require("moment"));
var home = function (req, res) {
    var test = req.headers['x-access-token'];
    //return all possible products sorted by the date
    product_1.default
        .find()
        .sort({ date: -1 })
        .lean()
        .limit(5)
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
//objects:
var publicController = {
    home: home,
    about: about
};
exports.publicController = publicController;
