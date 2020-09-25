import { model, Schema } from 'mongoose';
import { ObjectID } from 'mongodb';
;
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
const Cart = model('Cart', CartSchema);
export default Cart;
