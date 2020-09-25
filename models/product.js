import { model, Schema } from 'mongoose';
;
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
    }
});
//here maybe functions for this model...
const Product = model('Product', ProductSchema);
export default Product;
