var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import User from '../models/user';
let verifyCredentials = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let username = yield User.findOne({
        username: req.body.username
    }).lean().then((user) => {
        if (user)
            return false;
        else
            return true;
    });
    let email = yield User.findOne({
        email: req.body.email
    }).lean().then((user) => {
        if (user)
            return false;
        else
            return true;
    });
    if (username === false) {
        return res.json({
            success: false,
            msg: 'Username already exists'
        });
    }
    else if (email === false) {
        return res.json({
            success: false,
            msg: 'Email already exists'
        });
    }
    next();
});
const validateMiddleware = {
    verifyCredentials
};
export { validateMiddleware };
