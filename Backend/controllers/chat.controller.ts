//imports
import Messages, { IMessage } from '../models/messages';
import { ObjectID } from 'mongodb';
import { stringify } from 'querystring';
import Message from '../models/messages';

//////////////helper methods

//helper update method
let calcNewMessages = (messages: Array<Pick<any, any>>) => {
    let newMessages: Array<Object> = [];
    messages.forEach((message) => {
        let time = `${message.time.getHours()}:${message.time.getMinutes()} - ${message.time.getDate()}/${message.time.getMonth()}/${message.time.getFullYear()}`;
        
        const n = {
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
}

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

    let filterForUpdate = {
        to: user_id_object,
        from: chat_id_object,
        viewed: false
    };

    Messages
    .find(filter)
    .sort({time: 1})
    .lean()
    .then((messages) => {
        Message.updateMany(filterForUpdate, {viewed: true}, (err) => {
            if (err) throw err;
            else console.log(`Updated new logs in loadMessages`);

            let newMessages = calcNewMessages(messages);

            res.json({
                success: true,
                msg: 'loaded messages successfully',
                messages: newMessages
           }); 
        });
    });
};

const saveMessage = (req: any, res: any) => {
    console.log(req.body);
    let fromObject: ObjectID = new ObjectID(req.user_id);
    let toObject: ObjectID = new ObjectID(req.body.to);

    const message = new Messages({
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
    .then((data) => {
        res.json({
            success: true,
            msg: "succesfuly sent a message"
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

    Messages
    .find(filter)
    .sort({time: 1})
    .lean()
    .then((messages) => {        

        Messages.updateMany(filter, {viewed: true}, (err) => {
            if (err) throw err;
            else console.log(`Updated logs in getNewMessages.`);

            let newMessages = calcNewMessages(messages);

            res.json({
                success: true,
                msg: 'loaded messages successfully',
                messages: newMessages
            }); 
        })
    });
}

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
        res.json({
            success: true,
            msg: 'returned notifications',
            numOfMessages: messages.length
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