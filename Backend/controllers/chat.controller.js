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
exports.chatController = void 0;
//imports
var messages_1 = __importDefault(require("../models/messages"));
var mongodb_1 = require("mongodb");
var user_1 = __importDefault(require("../models/user"));
var moment_1 = __importDefault(require("moment"));
//////////////helper methods
///next time we're gonna update our way of updating messages with our own helper method,
//because in extreme cases current implementation would not work.
//helper update method
var calcNewMessages = function (messages) {
    if (messages == undefined)
        return null;
    var newMessages = [];
    messages.forEach(function (message) {
        var time = message.time.getHours() + ":" + message.time.getMinutes() + " - " + message.time.getDate() + "/" + (message.time.getMonth() + 1) + "/" + message.time.getFullYear();
        var n = {
            time: time,
            from: message.from,
            to: message.to,
            viewed: message.viewed,
            msg: message.msg,
            type: message.messageType,
            fromUsername: message.fromUsername,
            realTime: message.time,
            _id: message._id
        };
        newMessages.push(n);
    });
    return newMessages;
};
///helper for finding 'ago'
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
        return "a moment ago";
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
///helper for updating all messages that are seen
var updateAll = function (messages, user_id_object) { return __awaiter(void 0, void 0, void 0, function () {
    var _loop_1, i;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (messages == undefined)
                    return [2 /*return*/];
                _loop_1 = function (i) {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(String(user_id_object) == String(messages[i].to) && messages[i].viewed == false)) return [3 /*break*/, 2];
                                return [4 /*yield*/, messages_1.default.updateOne({ _id: messages[i]._id }, { viewed: true }, function (err) {
                                        if (err)
                                            throw err;
                                        else
                                            console.log("Redni broj promjene je : " + i);
                                    })];
                            case 1:
                                _a.sent();
                                _a.label = 2;
                            case 2: return [2 /*return*/];
                        }
                    });
                };
                i = 0;
                _a.label = 1;
            case 1:
                if (!(i < messages.length)) return [3 /*break*/, 4];
                return [5 /*yield**/, _loop_1(i)];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}); };
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
    // let filterForUpdate = {
    //     to: user_id_object,
    //     from: chat_id_object,
    //     viewed: false
    // };
    messages_1.default
        .find(filter)
        .sort({ time: 1 })
        .lean()
        .then(function (messages) {
        //new way of updating, that works 100% time
        updateAll(messages, user_id_object).then(function () {
            var newMessages = calcNewMessages(messages); //calc new messages
            res.json({
                success: true,
                msg: 'loaded messages successfully',
                messages: newMessages
            });
        });
        //ovo se pod hitno mora drugačije implementirati......
        // Message.updateMany(filterForUpdate, {viewed: true}, (err) => {
        //     if (err) throw err;
        //     else console.log(`Updated new logs in loadMessages`);
        //     let newMessages = calcNewMessages(messages);
        //     res.json({
        //         success: true,
        //         msg: 'loaded messages successfully',
        //         messages: newMessages
        //    }); 
        // });
    });
};
var saveMessage = function (req, res) {
    console.log(req.body);
    var fromObject = new mongodb_1.ObjectID(req.user_id);
    var toObject = new mongodb_1.ObjectID(req.body.to);
    var date = new Date();
    var message = new messages_1.default({
        from: fromObject,
        to: toObject,
        messageType: "String",
        msg: req.body.message,
        time: date,
        viewed: false,
        fromUsername: req.username,
        toUsername: req.body.toUsername
    });
    message
        .save()
        .then(function (data) {
        var newMessages = calcNewMessages([data]); // cause array is needed.
        var msg = "";
        if (newMessages != undefined)
            msg = newMessages[0];
        res.json({
            success: true,
            msg: "succesfuly sent a message",
            message: msg
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
    var filter2 = {
        from: user_id_object,
        to: chat_id_object,
        viewed: true
    };
    //find last message's view 
    messages_1.default
        .find(filter2)
        .sort({ time: -1 })
        .lean()
        .limit(1)
        .then(function (msgs) {
        var msg_id;
        if (msgs != undefined && msgs[0] != undefined)
            msg_id = msgs[0]._id;
        else
            msg_id = undefined;
        messages_1.default
            .find(filter)
            .sort({ time: 1 })
            .lean()
            .then(function (messages) {
            user_1.default
                .findById(chat_id_object)
                .lean()
                .then(function (user) {
                //find if chat person is active:
                var online = user === null || user === void 0 ? void 0 : user.online;
                var dateNow = new Date().toISOString();
                var lastTimeActive = findTime(dateNow, user === null || user === void 0 ? void 0 : user.lastTimeOnline);
                //new way of updating, that works 100% time
                updateAll(messages, user_id_object).then(function () {
                    var newMessages = calcNewMessages(messages); //calc new messages
                    res.json({
                        success: true,
                        msg: 'loaded messages successfully',
                        messages: newMessages,
                        seen_id: msg_id,
                        isOnline: online,
                        lastTimeOnline: lastTimeActive
                    });
                });
                // //ovo se pod hitno mora drugačije implementirati, i omogućiti u localstorage-u više chatova odjednom....
                // Messages.updateMany(filter, {viewed: true}, (err) => {
                //     if (err) throw err;
                //     else console.log(`Updated logs in getNewMessages.`);
                //     let newMessages = calcNewMessages(messages);
                //     res.json({
                //         success: true,
                //         msg: 'loaded messages successfully',
                //         messages: newMessages,
                //         seen_id: msg_id,
                //         isOnline: online,
                //         lastTimeOnline: lastTimeActive
                //     }); 
                // });
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
        var length = 0;
        if (messages != undefined)
            length = messages.length;
        res.json({
            success: true,
            msg: 'returned notifications',
            numOfMessages: length
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
