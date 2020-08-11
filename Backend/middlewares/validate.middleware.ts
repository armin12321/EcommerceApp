import { serverConfig } from '../configs/server.config';
import User from '../models/user';
import e from 'express';

let verifyCredentials = async (req: any, res: any, next: any) => {
    let username: boolean = await User.findOne({
        username: req.body.username
    }).lean().then((user) => {
        if (user) return false;
        else return true;
    });
    let email: boolean = await User.findOne({
        email: req.body.email
    }).lean().then((user) => {
        if (user)return false;
        else return true; 
    });
    if (username === false){
        return res.json({
            success: false,
            msg: 'Username already exists'
        });
    }else if (email === false){
        return res.json({
            success: false,
            msg: 'Email already exists'
        })
    }
    next();
}


const validateMiddleware = {
    verifyCredentials
};

export {validateMiddleware};