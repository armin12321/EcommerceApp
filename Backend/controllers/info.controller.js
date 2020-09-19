"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.infoController = void 0;
var messages_1 = __importDefault(require("../models/messages"));
var mongodb_1 = require("mongodb");
var user_1 = __importDefault(require("../models/user"));
//helpers :
var preprocess = function (messages) {
    var histogram = []; //holding already viewed messengers.
    var hasMessenger = function (histogram, messenger) {
        for (var i = 0; i < histogram.length; i++) {
            if (String(histogram[i].from) == String(messenger))
                return i; //return place of the messenger.
        }
        return -1;
    };
    for (var i = 0; i < messages.length; i++) {
        var index = hasMessenger(histogram, messages[i].from);
        if (index == -1) { //it has no messenger, push current.
            var time = messages[i].time.getHours() + ":" + messages[i].time.getMinutes() + " - " + messages[i].time.getDate() + "/" + (messages[i].time.getMonth() + 1) + "/" + messages[i].time.getFullYear();
            var newMessenger = {
                from: messages[i].from,
                fromUsername: messages[i].fromUsername,
                time: time,
                numOfMessages: 1
            };
            histogram.push(newMessenger);
        }
        else { //it has messenger with index - index, just update him.
            histogram[index].numOfMessages += 1;
            //compare dates and use the newest one (aka bigger when compared in milliseconds)
            if (histogram[index].time < messages[i].time) {
                histogram[index].time = messages[i].time;
            }
        }
    }
    return histogram;
};
var preprocess1 = function (messages, user_id_object) {
    var histogram = []; //holding already viewed messengers.
    var hasMessenger = function (histogram, messenger) {
        for (var i = 0; i < histogram.length; i++) {
            if (String(histogram[i].messengerID) == String(messenger)) {
                return i; //return place of the messenger.
            }
        }
        return -1;
    };
    for (var i = 0; i < messages.length; i++) {
        var messengerID = void 0;
        var username = void 0;
        if (String(user_id_object) == String(messages[i].from)) {
            messengerID = messages[i].to;
            username = messages[i].toUsername;
        }
        else {
            messengerID = messages[i].from;
            username = messages[i].fromUsername;
        }
        var index = hasMessenger(histogram, messengerID);
        if (index == -1) { //it has no messenger, push current.
            var time = messages[i].time.getHours() + ":" + messages[i].time.getMinutes() + " - " + messages[i].time.getDate() + "/" + (messages[i].time.getMonth() + 1) + "/" + messages[i].time.getFullYear();
            var newMessenger = {
                messengerID: messengerID,
                messengerUsername: username,
                time: time
            };
            histogram.push(newMessenger);
        }
        else { //it has messenger with index - index, just update him.            
            //compare dates and use the newest one (aka bigger when compared in milliseconds)
            if (histogram[index].time < messages[i].time) {
                histogram[index].time = messages[i].time;
            }
        }
    }
    return histogram;
};
/////////
var myOrders = function (req, res) {
    //later
};
var newMessages = function (req, res) {
    var user_id_object = new mongodb_1.ObjectID(req.user_id);
    var filter = {
        to: user_id_object,
        viewed: false
    };
    messages_1.default
        .find(filter)
        .sort({ time: -1 })
        .lean()
        .then(function (messages) {
        //find only messengers, and number of messages that they've sent.
        var newMessages = preprocess(messages);
        res.json({
            success: true,
            msg: 'succesfuly returned non viewed messages.',
            messages: newMessages
        });
    });
};
var recentChats = function (req, res) {
    var user_id_object = new mongodb_1.ObjectID(req.user_id);
    var filter = {
        $or: [
            { to: user_id_object },
            { from: user_id_object }
        ]
    };
    messages_1.default
        .find(filter)
        .sort({ time: -1 })
        .lean()
        .limit(10000)
        .then(function (messages) {
        //find only people that you've been chating to, and last time you've chatted
        var messengers = preprocess1(messages, user_id_object);
        res.json({
            success: true,
            msg: 'successfuly returned people that youve been chatting to.',
            people: messengers
        });
    });
};
var changeOnlineStatus = function (req, res) {
    console.log(req.body);
    console.log(req.username);
    console.log(req.user_id);
    var user_id_object = new mongodb_1.ObjectID(req.user_id);
    //change status in user field.
    var updateQuery = {
        online: req.body.online,
        lastTimeOnline: new Date()
    };
    user_1.default
        .findByIdAndUpdate(user_id_object, updateQuery)
        .lean()
        .then(function (user) {
        console.log("Status for " + req.username + " changed.");
    });
};
var infoController = {
    myOrders: myOrders,
    newMessages: newMessages,
    recentChats: recentChats,
    changeOnlineStatus: changeOnlineStatus
};
exports.infoController = infoController;
