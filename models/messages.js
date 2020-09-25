"use strict";
exports.__esModule = true;
var mongodb_1 = require("mongodb");
var mongoose_1 = require("mongoose");
;
var MessageSchema = new mongoose_1.Schema({
    from: {
        type: mongodb_1.ObjectID,
        required: true
    },
    to: {
        type: mongodb_1.ObjectID,
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
var Message = mongoose_1.model('Message', MessageSchema);
exports["default"] = Message;
