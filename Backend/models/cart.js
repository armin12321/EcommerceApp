"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var mongodb_1 = require("mongodb");
;
var CartSchema = new mongoose_1.Schema({
    user_id: {
        type: mongodb_1.ObjectID,
        required: true
    },
    products: {
        type: Object,
        required: true
    }
});
//here maybe some functions relevant for this model.
var Cart = mongoose_1.model('Cart', CartSchema);
exports.default = Cart;
