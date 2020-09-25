import { ObjectID } from 'mongodb';
import { model, Schema } from 'mongoose';
;
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
const Message = model('Message', MessageSchema);
export default Message;
