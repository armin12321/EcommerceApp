"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
var path_1 = __importDefault(require("path"));
var user_1 = __importDefault(require("../models/user"));
var cart_1 = __importDefault(require("../models/cart"));
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var server_config_1 = require("../configs/server.config");
var db_config_1 = require("../configs/db.config");
var mongodb_1 = require("mongodb");
var product_1 = __importDefault(require("../models/product"));
var fs_1 = __importDefault(require("fs"));
var moment_1 = __importDefault(require("moment"));
//helper funkcije.
//pronalazak vremena:
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
    if (sec == 0 && min == 0 && hours == 0 && days == 0 && months == 0 && years == 0)
        return 'a moment ago';
    return years + " years ago";
};
//functions:
var login = function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    //check if username exists
    user_1.default.findOne({
        username: username
    })
        .lean() //return json, instead of mongodb type.
        .then(function (user) {
        if (user) { //exists, check password:
            console.log(user); // to see what type is user.
            var passwordIsValid = bcryptjs_1.default.compareSync(password, user.password);
            if (!passwordIsValid) {
                res.json({
                    token: null,
                    success: false,
                    msg: 'Password is incorrect, please try again'
                });
            }
            else {
                var token = jsonwebtoken_1.default.sign({
                    username: user.username,
                    _id: user._id,
                    type: user.type,
                    email: user.email
                }, server_config_1.serverConfig.SECRET, { expiresIn: 86400 }); //one day.
                var modifiedUser = {
                    address: user.address,
                    avatarName: user.avatarName,
                    email: user.email,
                    name: user.name,
                    surname: user.surname,
                    type: user.type,
                    username: user.username,
                    _id: user._id,
                };
                res.json({
                    token: token,
                    success: true,
                    msg: 'Succesfuly logged in',
                    user: modifiedUser
                });
            }
        }
        else { //does not exist, return error.
            res.json({
                token: null,
                success: false,
                msg: 'Username does nost exist, please try again'
            });
        }
    });
};
var register = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var avatarName, uploaded, user, sampleFile, ext, uploadPath;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = new user_1.default({
                    name: req.body.name,
                    surname: req.body.surname,
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    address: req.body.address,
                    type: req.body.type,
                    avatarName: 'default.jpg',
                    online: true,
                    lastTimeOnline: new Date()
                });
                if (!req.files) return [3 /*break*/, 2];
                sampleFile = req.files.file;
                ext = path_1.default.extname(sampleFile.name);
                avatarName = req.body.username + ext;
                uploadPath = path_1.default.join(__dirname, '..', '/uploads/images/avatars/', avatarName);
                user.avatarName = avatarName;
                return [4 /*yield*/, sampleFile.mv(uploadPath, function (err) {
                        if (err) {
                            return res.json({
                                success: false,
                                msg: 'Something went wrong. Try again later'
                            });
                        }
                        else {
                            user.save().then(function (data) {
                                return res.json({
                                    success: true,
                                    msg: 'User successfully registered. You can now log in'
                                });
                            });
                        }
                    })];
            case 1:
                uploaded = _a.sent();
                return [3 /*break*/, 3];
            case 2:
                user.save().then(function (data) {
                    return res.json({
                        success: true,
                        msg: 'User successfully registered. You can now log in'
                    });
                });
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
var cart = function (req, res) {
    //if i'm not buyer, what do i need cart for then?
    if (req.user_type == db_config_1.dbConfig.user_type.SELLER) {
        res.json({
            success: false,
            msg: 'not a buyer',
            user: null
        });
    }
    else {
        var ID = new mongodb_1.ObjectID(req.user_id);
        var filter = {
            user_id: ID
        };
        cart_1.default
            .find(filter)
            .lean()
            .sort({ time: 1 })
            .then(function (carts) {
            res.json({
                success: true,
                msg: 'returned cart data',
                carts: carts
            });
        });
    }
};
var profile = function (req, res) {
    var ID = new mongodb_1.ObjectID(req.user_id);
    user_1.default
        .findById(ID)
        .lean()
        .then(function (u) {
        var user = {
            username: u === null || u === void 0 ? void 0 : u.username,
            name: u === null || u === void 0 ? void 0 : u.name,
            surname: u === null || u === void 0 ? void 0 : u.surname,
            email: u === null || u === void 0 ? void 0 : u.email,
            address: u === null || u === void 0 ? void 0 : u.address,
            type: u === null || u === void 0 ? void 0 : u.type,
            avatarName: u === null || u === void 0 ? void 0 : u.avatarName
        };
        res.json({
            success: true,
            user: user,
            msg: 'successfully returned user'
        });
    });
};
var products = function (req, res) {
    //if i'm not seller, i cannot have products page :
    if (req.user_type == db_config_1.dbConfig.user_type.BUYER) {
        res.json({
            success: false,
            msg: 'not a seller',
            products: null
        });
    }
    else {
        //nadji sve producte koji dolaze od ovog prodavca/sellera
        var ID = new mongodb_1.ObjectID(req.user_id);
        console.log(req);
        product_1.default
            .find({ "user._id": ID })
            .lean()
            .sort({ date: -1 })
            .then(function (products) {
            console.log(products);
            //find time for every of the products, then send them to the frontend:
            var timeNow = new Date().toISOString();
            var modifiedProducts = products.map(function (product, index) {
                var ago = findTime(timeNow, product.date);
                return {
                    ago: ago,
                    product: product
                };
            });
            res.json({
                success: true,
                msg: 'returned this sellers products',
                products: modifiedProducts
            });
        });
    }
};
var getByID = function (req, res) {
    //here getting req.body.ID
    console.log(req.body.id);
    var id = new mongodb_1.ObjectID(req.body.id);
    user_1.default
        .findById(id)
        .lean()
        .then(function (user) {
        console.log(user);
        res.json({
            success: true,
            avatarName: user === null || user === void 0 ? void 0 : user.avatarName,
            msg: 'Successfully returned by ID'
        });
    });
};
var addToCart = function (req, res) {
    console.log('evo mene u addToCart');
    console.log(req.body);
    var ID = new mongodb_1.ObjectID(req.user_id);
    var filter = {
        user_id: ID,
        product: req.body.product
    };
    cart_1.default
        .findOne(filter)
        .lean()
        .then(function (cart) {
        if (cart != undefined) {
            res.json({
                msg: 'already exists',
                success: true
            });
        }
        else {
            var cart_2 = new cart_1.default({
                user_id: req.user_id,
                product: req.body.product,
                quantity: req.body.quantity,
                time: new Date()
            });
            cart_2
                .save()
                .then(function (product) {
                console.log(product);
                res.json({
                    success: true,
                    msg: 'Uspješno dodano u košaricu',
                    product: product
                });
            });
        }
    });
};
var deleteFromCart = function (req, res) {
    var ID = new mongodb_1.ObjectID(req.body.ID);
    cart_1.default
        .findByIdAndDelete(ID)
        .lean()
        .then(function (cart) {
        res.json({
            success: true,
            msg: 'deleted cart by id',
            deletedCart: cart
        });
    });
};
var updateCartQuantity = function (req, res) {
    var ID = new mongodb_1.ObjectID(req.body.ID);
    var quantity = req.body.quantity;
    var filter = {
        $set: {
            quantity: quantity
        }
    };
    cart_1.default
        .findByIdAndUpdate(ID, filter)
        .lean()
        .then(function (cart) {
        res.json({
            success: true,
            msg: 'updated with id',
            updatedCart: cart
        });
    });
};
var updateInfo = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var ID, newFile, avatarName, filter;
    return __generator(this, function (_a) {
        ID = new mongodb_1.ObjectID(req.user_id);
        newFile = undefined;
        if (req.files)
            newFile = req.files.file;
        avatarName = req.body.previousAvatar;
        if (newFile != undefined)
            avatarName = req.body.username + path_1.default.extname(newFile.name);
        console.log(req.body);
        filter = {
            name: req.body.name,
            username: req.body.username,
            surname: req.body.surname,
            email: req.body.email,
            address: req.body.address,
            avatarName: avatarName
        };
        //update user in User collection
        user_1.default
            .findByIdAndUpdate(ID, { $set: filter })
            .lean()
            .then(function (user) { return __awaiter(void 0, void 0, void 0, function () {
            var filter1, uploadPath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Updated user:');
                        console.log(user);
                        if (!(req.user_type == db_config_1.dbConfig.user_type.SELLER)) return [3 /*break*/, 1];
                        filter1 = {
                            "user.name": req.body.name,
                            "user.username": req.body.username,
                            "user.surname": req.body.surname,
                            "user.email": req.body.email,
                            "user.address": req.body.address,
                            "user.avatarName": avatarName
                        };
                        product_1.default
                            .updateMany({ "user._id": ID }, { $set: filter1 })
                            .lean()
                            .then(function (product) {
                            console.log('Updated product(s):');
                            if (product != undefined)
                                console.log(product);
                            //Update user in all of the cart documents
                            var filter2 = {
                                "product.user.name": req.body.name,
                                "product.user.username": req.body.username,
                                "product.user.surname": req.body.surname,
                                "product.user.address": req.body.address,
                                "product.user.email": req.body.email,
                                "product.user.avatarName": avatarName
                            };
                            cart_1.default
                                .updateMany({ "product.user._id": req.user_id }, { $set: filter2 })
                                .lean()
                                .then(function (carts) { return __awaiter(void 0, void 0, void 0, function () {
                                var uploadPath;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            console.log('Updated cart(s):');
                                            if (carts != undefined)
                                                console.log(carts);
                                            if (!(newFile != null)) return [3 /*break*/, 2];
                                            //izbriši staru sliku ako postoji
                                            if (req.body.previousAvatar != 'default.jpg' && fs_1.default.existsSync(path_1.default.join(__dirname, '../uploads/images/avatars', req.body.previousAvatar)))
                                                fs_1.default.unlinkSync(path_1.default.join(__dirname, '../uploads/images/avatars', req.body.previousAvatar));
                                            uploadPath = path_1.default.join(__dirname, '..', '/uploads/images/avatars/', avatarName);
                                            return [4 /*yield*/, newFile.mv(uploadPath, function (err) {
                                                    if (err) {
                                                        res.json({
                                                            success: false,
                                                            msg: 'Something went wrong. Try again later'
                                                        });
                                                    }
                                                    else {
                                                        return res.json({
                                                            success: true,
                                                            msg: 'successfully updated user in user database.',
                                                            user: user
                                                        });
                                                    }
                                                })];
                                        case 1:
                                            _a.sent();
                                            return [3 /*break*/, 3];
                                        case 2:
                                            res.json({
                                                success: true,
                                                msg: 'successfully updated user in user database.',
                                                user: user
                                            });
                                            _a.label = 3;
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); });
                        });
                        return [3 /*break*/, 4];
                    case 1:
                        if (!(newFile != null)) return [3 /*break*/, 3];
                        //izbriši staru sliku ako postoji
                        if (req.body.previousAvatar != 'default.jpg' && fs_1.default.existsSync(path_1.default.join(__dirname, '../uploads/images/avatars', req.body.previousAvatar)))
                            fs_1.default.unlinkSync(path_1.default.join(__dirname, '../uploads/images/avatars', req.body.previousAvatar));
                        uploadPath = path_1.default.join(__dirname, '..', '/uploads/images/avatars/', avatarName);
                        return [4 /*yield*/, newFile.mv(uploadPath, function (err) {
                                if (err) {
                                    res.json({
                                        success: false,
                                        msg: 'Something went wrong. Try again later'
                                    });
                                }
                                else {
                                    res.json({
                                        success: true,
                                        msg: 'successfully updated user in user database.',
                                        user: user
                                    });
                                }
                            })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        res.json({
                            success: true,
                            msg: 'successfully updated user in user database.',
                            user: user
                        });
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); };
var userController = {
    updateInfo: updateInfo,
    getByID: getByID,
    register: register,
    login: login,
    cart: cart,
    profile: profile,
    products: products,
    addToCart: addToCart,
    deleteFromCart: deleteFromCart,
    updateCartQuantity: updateCartQuantity
};
exports.userController = userController;
