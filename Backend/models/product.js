"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
;
var ProductSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    user: {
        type: Object,
        required: true
    },
    price: {
        type: Number,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    available: {
        type: Number,
        required: true
    },
    condition: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    purchased: {
        type: Number,
        required: true
    },
    images: {
        type: Array,
        required: false
    },
    manufacturer: {
        type: String,
        required: true
    },
    categories: {
        type: Array,
        required: false
    },
    infoObjects: {
        type: Array,
        required: false
    }
});
//here maybe functions for this model...
var Product = mongoose_1.model('Product', ProductSchema);
exports.default = Product;
