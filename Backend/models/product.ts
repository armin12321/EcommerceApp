import { Document, model, Schema } from 'mongoose';

export interface IProduct extends Document {
    name: String,
    user: Object,
    price: number,
    description: string,
    available: number, //how much more.
    condition: string,
    date: Date,
    purchased: number,
    images: Array<string>,
    manufacturer: string,
    categories: Array<string>,
    infoObjects: Array<object>
};

const ProductSchema = new Schema({
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
    date : {
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

const Product = model<IProduct>('Product', ProductSchema);

export default Product;