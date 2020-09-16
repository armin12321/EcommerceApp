"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatController = void 0;
//imports
var messages_1 = __importDefault(require("../models/messages"));
var mongodb_1 = require("mongodb");
var messages_2 = __importDefault(require("../models/messages"));
//////////////helper methods
//helper update method
var calcNewMessages = function (messages) {
    var newMessages = [];
    messages.forEach(function (message) {
        var time = message.time.getHours() + ":" + message.time.getMinutes() + " - " + message.time.getDate() + "/" + message.time.getMonth() + "/" + message.time.getFullYear();
        var n = {
            time: time,
            from: message.from,
            to: message.to,
            viewed: message.viewed,
            msg: message.msg,
            type: message.messageType,
            fromUsername: message.fromUsername
        };
        newMessages.push(n);
    });
    return newMessages;
};
///////////////////////
var loadMessages = function (req, res) {
    console.log(req.body);
    var user_id = req.user_id;
    var chat_id = req.body.chat_id;
    var user_id_object = new mongodb_1.ObjectID(user_id);
    var chat_id_object = new mongodb_1.ObjectID(chat_id);
    //load all messages where from and to are user_id_object and chat_id_object.
    var filter = {
        to: {
            $in: [user_id_object, chat_id_object]
        },
        from: {
            $in: [user_id_object, chat_id_object]
        }
    };
    var filterForUpdate = {
        to: user_id_object,
        from: chat_id_object,
        viewed: false
    };
    messages_1.default
        .find(filter)
        .sort({ time: 1 })
        .lean()
        .then(function (messages) {
        messages_2.default.updateMany(filterForUpdate, { viewed: true }, function (err) {
            if (err)
                throw err;
            else
                console.log("Updated new logs in loadMessages");
            var newMessages = calcNewMessages(messages);
            res.json({
                success: true,
                msg: 'loaded messages successfully',
                messages: newMessages
            });
        });
    });
};
var saveMessage = function (req, res) {
    console.log(req.body);
    var fromObject = new mongodb_1.ObjectID(req.user_id);
    var toObject = new mongodb_1.ObjectID(req.body.to);
    var message = new messages_1.default({
        from: fromObject,
        to: toObject,
        messageType: "String",
        msg: req.body.message,
        time: new Date(),
        viewed: false,
        fromUsername: req.username
    });
    message
        .save()
        .then(function (data) {
        res.json({
            success: true,
            msg: "succesfuly sent a message"
        });
    });
};
var getNewMessages = function (req, res) {
    console.log(req.body);
    var user_id = req.user_id;
    var chat_id = req.body.chat_id;
    var user_id_object = new mongodb_1.ObjectID(user_id);
    var chat_id_object = new mongodb_1.ObjectID(chat_id);
    console.log("User is " + req.username + ", and his ID is " + user_id_object);
    var filter = {
        from: chat_id_object,
        to: user_id_object,
        viewed: false
    };
    messages_1.default
        .find(filter)
        .sort({ time: 1 })
        .lean()
        .then(function (messages) {
        messages_1.default.updateMany(filter, { viewed: true }, function (err) {
            if (err)
                throw err;
            else
                console.log("Updated logs in getNewMessages.");
            var newMessages = calcNewMessages(messages);
            res.json({
                success: true,
                msg: 'loaded messages successfully',
                messages: newMessages
            });
        });
    });
};
var notifications = function (req, res) {
    var user_id = new mongodb_1.ObjectID(req.user_id);
    var filter = {
        to: user_id,
        viewed: false
    };
    messages_1.default
        .find(filter)
        .sort({ time: -1 })
        .lean()
        .then(function (messages) {
        //we do not need update for our notifications, just messages.
        res.json({
            success: true,
            msg: 'returned notifications',
            numOfMessages: messages.length
        });
    });
};
var chatController = {
    loadMessages: loadMessages,
    saveMessage: saveMessage,
    getNewMessages: getNewMessages,
    notifications: notifications
};
exports.chatController = chatController;
