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
////////helpers
var preprocessInfoObjects = function (infoObjects) {
    /// object = {
    //  key: 'nesto valko tamo nako',
    //  value: 'nesto tamo nako vamo'
    //}
    var newArray = [];
    for (var _i = 0, infoObjects_1 = infoObjects; _i < infoObjects_1.length; _i++) {
        var object = infoObjects_1[_i];
        var newObject = {
            "$elemMatch": {
                "key": {
                    $regex: "" + object.key,
                    $options: 'i'
                },
                "value": {
                    $regex: "" + object.value,
                    $options: 'i'
                }
            }
        };
        newArray.push(newObject);
    }
    return newArray;
};
///////////
var home = function (req, res) {
    //return all possible products sorted by the date
    console.log(req.body);
    var filter = {};
    var ctg = req.body.categories;
    //////////PRETRAGA:::::
    //kategorije
    if (ctg.length > 0)
        filter["categories"] = ctg.pop();
    //cijena
    filter["price"] = {
        $gt: req.body.priceMin,
        $lt: req.body.priceMax
    };
    //stanje
    if (req.body.condition != "")
        filter["condition"] = req.body.condition;
    //prodavač proizvoda
    if (req.body.seller != "")
        filter["$or"] = [
            {
                "user.username": {
                    $regex: "" + req.body.seller,
                    $options: 'i'
                }
            },
            {
                "user.name": {
                    $regex: "" + req.body.seller,
                    $options: 'i'
                },
            },
            {
                "user.surname": {
                    $regex: "" + req.body.seller,
                    $options: 'i'
                }
            }
        ];
    //proizvođač
    if (req.body.manufacturer != "")
        filter["manufacturer"] = {
            $regex: "" + req.body.manufacturer,
            $options: 'i'
        };
    //info objekti - trebam da vratim onoga koji sadrži sve navedene objekte:
    if (req.body.infoObjects.length > 0)
        filter["infoObjects"] = {
            $all: preprocessInfoObjects(req.body.infoObjects)
        };
    console.log('Napravljeni filter od proslijeđenih informacija je :');
    console.log(filter);
    if (filter["infoObjects"] != undefined)
        console.log(filter["infoObjects"].$all[0]);
    product_1.default
        .find(filter)
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
