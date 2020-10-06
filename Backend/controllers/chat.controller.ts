//imports
import Messages, { IMessage } from '../models/messages';
import { ObjectID } from 'mongodb';
import Message from '../models/messages';
import User from '../models/user';
import moment from 'moment';

//////////////helper methods
///next time we're gonna update our way of updating messages with our own helper method,
//because in extreme cases current implementation would not work.

//helper update method
let calcNewMessages = (messages: Array<any>) => {
    if (messages == undefined)
        return null;

    let newMessages: Array<Object> = [];
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
            realTime: message.time, //da mogu pretraživat bazu 
            _id: message._id
        };
        newMessages.push(n);
    });

    return newMessages;
}

///helper for finding 'ago'
let findTime = (bigger: any, smaller: any) => {
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
    if (sec == 0 && min == 0 && hours == 0 && days == 0 && months == 0 && years == 0)
        return `a moment ago`;
    return `${years} years ago`;
}

///helper for updating all messages that are seen
let updateAll = async (messages: Array<any>, user_id_object: any) => {
    if (messages == undefined)
        return;
   for (let i = 0; i < messages.length; i++) {
       //see if I need to update this 
       if (String(user_id_object) == String(messages[i].to) && messages[i].viewed == false) {

            await Messages.updateOne({_id: messages[i]._id}, {viewed: true}, (err) => {
                if (err) throw err;
                else console.log(`Redni broj promjene je : ${i}`);
            });
       }
   }   
};

///////////////////////

const loadMessages = (req: any, res: any) => {
    console.log(req.body);

    let user_id: string = req.user_id;
    let chat_id: string = req.body.chat_id;

    let user_id_object: ObjectID = new ObjectID(user_id);
    let chat_id_object: ObjectID = new ObjectID(chat_id);

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
    .sort({time: 1})
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

const saveMessage = (req: any, res: any) => {
    console.log(req.body);
    let fromObject: ObjectID = new ObjectID(req.user_id);
    let toObject: ObjectID = new ObjectID(req.body.to);
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
        let msg: any = "";

        if (newMessages != undefined)
            msg = newMessages[0];

        res.json({
            success: true,
            msg: "succesfuly sent a message",            
            message: msg            
        });
    });
}

const getNewMessages = (req: any, res: any) => {
    console.log(req.body);

    let user_id: string = req.user_id;
    let chat_id: string = req.body.chat_id;

    let user_id_object: ObjectID = new ObjectID(user_id);
    let chat_id_object: ObjectID = new ObjectID(chat_id);


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
    .sort({time: -1})
    .lean()
    .limit(1)
    .then((msgs) => {
        let msg_id:any;
        
        if (msgs != undefined && msgs[0] != undefined)
            msg_id = msgs[0]._id;
        else
            msg_id = undefined;

        Messages
        .find(filter)
        .sort({time: 1})
        .lean()
        .then((messages) => {        
            User
            .findById(chat_id_object)
            .lean()
            .then((user) => {
                //find if chat person is active:
                let online: any = user?.online;
                let dateNow = new Date().toISOString();
                let lastTimeActive: String = findTime(dateNow, user?.lastTimeOnline);                            

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

const notifications = (req: any, res: any) => {
    const user_id = new ObjectID(req.user_id);

    const filter = {
        to: user_id,
        viewed: false
    };

    Messages
    .find(filter)
    .sort({time: -1})
    .lean()
    .then((messages) => {
        //we do not need update for our notifications, just messages.
        let length = 0;

        if (messages != undefined)
            length = messages.length;

        res.json({
            success: true,
            msg: 'returned notifications',
            numOfMessages: length
        });
    });
}

const chatController = {
    loadMessages,
    saveMessage,
    getNewMessages,
    notifications
};

export {chatController};