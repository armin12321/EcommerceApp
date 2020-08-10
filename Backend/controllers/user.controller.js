"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
var path_1 = __importDefault(require("path"));
var user_1 = __importDefault(require("../models/user"));
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var server_config_1 = require("../configs/server.config");
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
                    password: user.password,
                    email: user.email
                }, server_config_1.serverConfig.SECRET, { expiresIn: 86400 });
                res.json({
                    token: token,
                    success: true,
                    msg: 'Succesfuly logged in',
                    user: user
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
var register = function (req, res) {
    var avatarName;
    if (!req.files) {
        avatarName = 'default.jpg';
    }
    else {
        var sampleFile = req.files.file;
        var ext = path_1.default.extname(sampleFile.name);
        avatarName = req.body.username + ext;
        var uploadPath = path_1.default.join(__dirname, '..', '/uploads/images/avatars/', avatarName);
        sampleFile.mv(uploadPath, function (err) {
            if (err) {
                return res.json({
                    success: false,
                    msg: 'Something went wrong while uploading profile image'
                });
            }
        });
    }
    var user = new user_1.default({
        name: req.body.name,
        surname: req.body.surname,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        address: req.body.address,
        type: req.body.type,
        avatarName: avatarName
    });
    user.save();
    return res.json({
        success: true,
        msg: 'User registered successfully'
    });
};
var cart = function (req, res) {
    var user = {
        username: req.username,
        password: req.password,
        email: req.email
    };
    console.log(user);
    res.json({
        msg: 'Here i am at my cart!!!',
        user: user
    });
};
var profile = function (req, res) {
    var user = {
        username: req.username,
        password: req.password,
        email: req.email
    };
    console.log(user);
    res.json({
        msg: 'Here i am at my profile page!!!',
        user: user
    });
};
var userController = {
    register: register,
    login: login,
    cart: cart,
    profile: profile
};
exports.userController = userController;
