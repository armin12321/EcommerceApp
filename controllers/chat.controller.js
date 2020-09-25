var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//imports
import Messages from '../models/messages';
import { ObjectID } from 'mongodb';
import User from '../models/user';
import moment from 'moment';
//////////////helper methods
///next time we're gonna update our way of updating messages with our own helper method,
//because in extreme cases current implementation would not work.
//helper update method
let calcNewMessages = (messages) => {
    let newMessages = [];
    messages.forEach((message) => {
        let time = `${message.time.getHours()}:${message.time.getMinutes()} - ${message.time.getDate()}/${message.time.getMonth() + 1}/${message.time.getFullYear()}`;
        const n = {
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
let findTime = (bigger, smaller) => {
    let bigg = moment(bigger);
    let small = moment(smaller);
    let sec = bigg.diff(small, 'seconds');
    let min = bigg.diff(small, 'minutes');
    let hours = bigg.diff(small, 'hours');
    let days = bigg.diff(small, 'days');
    let months = bigg.diff(small, 'months');
    let years = bigg.diff(small, 'years');
    if (sec != 0 && sec < 60)
        return `a moment ago`;
    if (min != 0 && min < 60)
        return `${min} minutes ago`;
    if (hours != 0 && hours < 24)
        return `${hours} hours ago`;
    if (days != 0 && days < 30)
        return `${days} days ago`;
    if (months != 0 && months < 12)
        return `${months} months ago`;
    return `${years} years ago`;
};
///helper for updating all messages that are seen
let updateAll = (messages, user_id_object) => __awaiter(void 0, void 0, void 0, function* () {
    for (let i = 0; i < messages.length; i++) {
        //see if I need to update this 
        if (String(user_id_object) == String(messages[i].to) && messages[i].viewed == false) {
            yield Messages.updateOne({ _id: messages[i]._id }, { viewed: true }, (err) => {
                if (err)
                    throw err;
                else
                    console.log(`Redni broj promjene je : ${i}`);
            });
        }
    }
});
///////////////////////
const loadMessages = (req, res) => {
    console.log(req.body);
    let user_id = req.user_id;
    let chat_id = req.body.chat_id;
    let user_id_object = new ObjectID(user_id);
    let chat_id_object = new ObjectID(chat_id);
    //load all messages where from and to are user_id_object and chat_id_object.
    let filter = {
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
    Messages
        .find(filter)
        .sort({ time: 1 })
        .lean()
        .then((messages) => {
        //new way of updating, that works 100% time
        updateAll(messages, user_id_object).then(() => {
            let newMessages = calcNewMessages(messages); //calc new messages
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
const saveMessage = (req, res) => {
    console.log(req.body);
    let fromObject = new ObjectID(req.user_id);
    let toObject = new ObjectID(req.body.to);
    let date = new Date();
    const message = new Messages({
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
        .then((data) => {
        let newMessages = calcNewMessages([data]); // cause array is needed.
        res.json({
            success: true,
            msg: "succesfuly sent a message",
            message: newMessages[0]
        });
    });
};
const getNewMessages = (req, res) => {
    console.log(req.body);
    let user_id = req.user_id;
    let chat_id = req.body.chat_id;
    let user_id_object = new ObjectID(user_id);
    let chat_id_object = new ObjectID(chat_id);
    console.log(`User is ${req.username}, and his ID is ${user_id_object}`);
    const filter = {
        from: chat_id_object,
        to: user_id_object,
        viewed: false
    };
    const filter2 = {
        from: user_id_object,
        to: chat_id_object,
        viewed: true
    };
    //find last message's view 
    Messages
        .find(filter2)
        .sort({ time: -1 })
        .lean()
        .limit(1)
        .then((msgs) => {
        let msg_id;
        if (msgs == undefined)
            msg_id = undefined;
        else
            msg_id = msgs[0]._id;
        Messages
            .find(filter)
            .sort({ time: 1 })
            .lean()
            .then((messages) => {
            User
                .findById(chat_id_object)
                .lean()
                .then((user) => {
                //find if chat person is active:
                let online = user === null || user === void 0 ? void 0 : user.online;
                let dateNow = new Date().toISOString();
                let lastTimeActive = findTime(dateNow, user === null || user === void 0 ? void 0 : user.lastTimeOnline);
                //new way of updating, that works 100% time
                updateAll(messages, user_id_object).then(() => {
                    let newMessages = calcNewMessages(messages); //calc new messages
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
const notifications = (req, res) => {
    const user_id = new ObjectID(req.user_id);
    const filter = {
        to: user_id,
        viewed: false
    };
    Messages
        .find(filter)
        .sort({ time: -1 })
        .lean()
        .then((messages) => {
        //we do not need update for our notifications, just messages.
        res.json({
            success: true,
            msg: 'returned notifications',
            numOfMessages: messages.length
        });
    });
};
const chatController = {
    loadMessages,
    saveMessage,
    getNewMessages,
    notifications
};
export { chatController };
