import { Document, model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

const SALT_WORK_FACTOR = 10;

export interface IUser extends Document {
    name: string;
    surname: string;
    username: string;
    email: string;
    password: string;
    address: string;
    type: string;
    avatarName: string;
};

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    avatarName: {
        type: String,
        required: true
    }
});

const addUser = (newUser: any, callback: any) => {
    bcrypt.genSalt(10, (err: any, salt: any) => {
        bcrypt.hash(newUser.password, salt, (err: any, hash: any) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save().then(callback);
        })
    });
}

UserSchema.pre('save', function (next) {
    var user: any = this;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});


const User = model<IUser>('User', UserSchema);

export default User;
export {addUser};
