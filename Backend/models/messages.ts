import { ObjectID } from 'mongodb';
import { Document, model, Schema } from 'mongoose';

export interface IMessage extends Document {
    from: ObjectID,
    to: ObjectID,
    msg: String,
    time: Date,
    viewed: Boolean,
    messageType: String,
    fromUsername: String,
    toUsername: String
};

const MessageSchema = new Schema({
    from: {
        type: ObjectID,
        required: true
    },
    to: {
        type: ObjectID,
        required: true
    },
    time: {
        type: Date,
        required: true
    },
    viewed: {
        type: Boolean,
        required: false
    },
    msg: {
        type: String,
        required: true
    },
    messageType: {
        type: String,
        required: true
    },
    fromUsername: {
        type: String,
        required: true
    },
    toUsername: {
        type: String,
        required: true
    }
});

//here maybe functions for this model...

const Message = model<IMessage>('Message', MessageSchema);

export default Message;