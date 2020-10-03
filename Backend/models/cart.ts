import { Document, model, Schema } from 'mongoose';
import { ObjectID } from 'mongodb';

export interface ICart extends Document {
    user_id: ObjectID,
    product: Object,
    quantity: number,
    time: Date
};

const CartSchema = new Schema({
    user_id: {
        type: ObjectID,
        required: true
    },
    product: {
        type: Object,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    time: {
        type: Date,
        required: true
    }
});

//here maybe some functions relevant for this model.

const Cart = model<ICart>('Cart', CartSchema);

export default Cart;