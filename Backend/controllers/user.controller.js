"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
var path_1 = __importDefault(require("path"));
var user_1 = __importDefault(require("../models/user"));
//functions:
var login = function (req, res) {
    res.json({
        msg: 'Served login page',
        data: req.body
    });
};
var register = function (req, res) {
    var sampleFile = req.files.file;
    var ext = path_1.default.extname(sampleFile.name);
    var avatarName = req.body.username + ext;
    var uploadPath = path_1.default.join(__dirname, '..', '/uploads/images/avatars/', avatarName);
    sampleFile.mv(uploadPath, function (err) {
        if (err) {
            return res.json({
                success: false,
                msg: 'Something went wrong while uploading profile image'
            });
        }
    });
    var user = new user_1.default({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        avatarName: avatarName
    });
    user.save();
    return res.json({
        success: true,
        msg: 'User registered successfully'
    });
};
var userController = {
    register: register,
    login: login
};
exports.userController = userController;
