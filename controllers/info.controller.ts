import Messages, { IMessage } from '../models/messages';
import { ObjectID } from 'mongodb';
import User, {IUser} from '../models/user';

//helpers :

let preprocess = (messages: Array<any>) => {
    let histogram: Array<any> = []; //holding already viewed messengers.

    let hasMessenger = (histogram: Array<any>, messenger: ObjectID) => {
        for (let i = 0; i < histogram.length; i++) {
            if (String(histogram[i].from) == String(messenger))
                return i; //return place of the messenger.
        }
        return -1;
    }

    for (let i = 0; i < messages.length; i++) {
        let index = hasMessenger(histogram, messages[i].from);

        if (index == -1) { //it has no messenger, push current.
            let time = `${messages[i].time.getHours()}:${messages[i].time.getMinutes()} - ${messages[i].time.getDate()}/${messages[i].time.getMonth() + 1}/${messages[i].time.getFullYear()}`;
            let newMessenger = {
                from: messages[i].from,
                fromUsername: messages[i].fromUsername,
                time: time,
                numOfMessages: 1
            }

            histogram.push(newMessenger);
        } else { //it has messenger with index - index, just update him.
            histogram[index].numOfMessages += 1;
            //compare dates and use the newest one (aka bigger when compared in milliseconds)
            if (histogram[index].time < messages[i].time) {
                histogram[index].time = messages[i].time;
            }
        }

    }

    return histogram;
};

let preprocess1 = (messages: Array<any>, user_id_object: ObjectID) => {
    let histogram: Array<any> = []; //holding already viewed messengers.

    let hasMessenger = (histogram: Array<any>, messenger: ObjectID) => {
        
        for (let i = 0; i < histogram.length; i++) {            
            if (String(histogram[i].messengerID) == String(messenger)) { 
                return i; //return place of the messenger.
            }                
        }
        return -1;
    }

    for (let i = 0; i < messages.length; i++) {
        let messengerID: ObjectID;
        let username: String;

        if (String(user_id_object) == String(messages[i].from)) {
            messengerID = messages[i].to;
            username = messages[i].toUsername;
        }            
        else {
            messengerID = messages[i].from;
            username = messages[i].fromUsername;
        }            

        let index = hasMessenger(histogram, messengerID);

        if (index == -1) { //it has no messenger, push current.
            let time = `${messages[i].time.getHours()}:${messages[i].time.getMinutes()} - ${messages[i].time.getDate()}/${messages[i].time.getMonth() + 1}/${messages[i].time.getFullYear()}`;
            let newMessenger = {
                messengerID: messengerID,
                messengerUsername: username,
                time: time
            };

            histogram.push(newMessenger);
        } else { //it has messenger with index - index, just update him.            
            //compare dates and use the newest one (aka bigger when compared in milliseconds)
            if (histogram[index].time < messages[i].time) {
                histogram[index].time = messages[i].time;
            }
        }

    }

    return histogram;
};

/////////

let myOrders = (req: any, res: any) => {
    //later
};

let newMessages = (req: any, res: any) => {
    let user_id_object = new ObjectID(req.user_id);

    let filter = {
        to: user_id_object,
        viewed: false
    };

    Messages
    .find(filter)
    .sort({time: -1})
    .lean()
    .then((messages) => {
        //find only messengers, and number of messages that they've sent.
        let newMessages = preprocess(messages);

        res.json({
            success: true,
            msg: 'succesfuly returned non viewed messages.',
            messages: newMessages
        });
    });
};

let recentChats = (req: any, res: any) => {
    let user_id_object = new ObjectID(req.user_id);

    let filter = {
        $or: [
            {to: user_id_object},
            {from: user_id_object}
        ]
    };

    Messages
    .find(filter)
    .sort({time: -1})
    .lean()
    .limit(10000)
    .then((messages) => {
        //find only people that you've been chating to, and last time you've chatted
        let messengers = preprocess1(messages, user_id_object);

        res.json({
            success: true,
            msg: 'successfuly returned people that youve been chatting to.',
            people: messengers
        });
    });
};

let changeOnlineStatus = (req: any, res: any) => {
    console.log(req.body);
    console.log(req.username);
    console.log(req.user_id);

    let user_id_object = new ObjectID(req.user_id);

    //change status in user field.

    let updateQuery = {
        online: req.body.online,
        lastTimeOnline: new Date()
    };

    User
    .findByIdAndUpdate(user_id_object, updateQuery)
    .lean()
    .then((user) => {        
        console.log(`Status for ${req.username} changed.`);
    });
};

const infoController = {
    myOrders,
    newMessages,
    recentChats,
    changeOnlineStatus
};

export {infoController};
