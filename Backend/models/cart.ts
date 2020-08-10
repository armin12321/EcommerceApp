import { Document, model, Schema } from 'mongoose';
import { ObjectID } from 'mongodb';

export interface ICart extends Document {
    user_id: ObjectID,
    products: Object
};

const CartSchema = new Schema({
    user_id: {
        type: ObjectID,
        required: true
    },
    products: {
        type: Object,
        required: true
    }
});

//here maybe some functions relevant for this model.

const Cart = model<ICart>('Cart', CartSchema);

export default Cart;