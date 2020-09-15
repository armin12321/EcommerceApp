//imports
import Messages, { IMessage } from '../models/messages';
import { ObjectID } from 'mongodb';


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
        let newMessages: Array<Object> = [];
        messages.forEach((message) => {
            let time = `${message.time.getHours()}:${message.time.getMinutes()} - ${message.time.getDate()}/${message.time.getMonth()}/${message.time.getFullYear()}`;
            console.log(time);
            const n =  {
                time: time,
                from: message.from,
                to: message.to,
                viewed: message.viewed,
                msg: message.msg,
                type: message.messageType
            };
            newMessages.push(n);
        })
        Messages.updateMany(filterForUpdate,{viewed: true},(err: any) => {
            if (err) throw err;
            res.json({
                success: true,
                msg: 'loaded messages successfully',
                messages: newMessages
            });
        })
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
        viewed: false
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

const chatController = {
    loadMessages,
    saveMessage
};

export {chatController};