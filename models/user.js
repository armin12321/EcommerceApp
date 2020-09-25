import { model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
const SALT_WORK_FACTOR = 10;
;
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
    },
    online: {
        type: Boolean,
        required: false
    },
    lastTimeOnline: {
        type: Date,
        required: false
    }
});
const addUser = (newUser, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err)
                throw err;
            newUser.password = hash;
            newUser.save().then(callback);
        });
    });
};
UserSchema.pre('save', function (next) {
    var user = this;
    if (!user.isModified('password'))
        return next();
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err)
            return next(err);
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err)
                return next(err);
            user.password = hash;
            next();
        });
    });
});
const User = model('User', UserSchema);
export default User;
export { addUser };
