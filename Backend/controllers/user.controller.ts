import path from 'path';
import User from '../models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { serverConfig } from '../configs/server.config';

//functions:

const login = (req: any, res: any) => {
    const username: string = req.body.username;
    const password: string = req.body.password;

    //check if username exists
    User.findOne({
        username: username
    })
    .lean() //return json, instead of mongodb type.
    .then((user) => {
        if (user) { //exists, check password:
            console.log(user); // to see what type is user.

            let passwordIsValid = bcrypt.compareSync(
                password,
                user.password
            );
             
            if (!passwordIsValid) {
                res.json({
                    token: null,
                    success: false,
                    msg: 'Password is incorrect, please try again'
                });
            } else {                
                let token: any = jwt.sign({
                    username: user.username,
                    password: user.password,
                    email: user.email
                }, serverConfig.SECRET, {expiresIn: 86400});  

                res.json({
                    token: token,
                    success: true,
                    msg: 'Succesfuly logged in',
                    user: user                    
                });
            }
        } else { //does not exist, return error.
            res.json({
                token: null,
                success: false,
                msg: 'Username does nost exist, please try again'
            });
        }
    });    
}

const register = (req: any, res: any) => {
    let avatarName;
    if (!req.files){
        avatarName = 'default.jpg';
    }else {
        let sampleFile = req.files.file;
        const ext = path.extname(sampleFile.name);
        avatarName = req.body.username + ext;
        let uploadPath = path.join(__dirname, '..', '/uploads/images/avatars/', avatarName);
        sampleFile.mv(uploadPath, function(err:any){
            if (err){
                return res.json({
                    success: false,
                    msg: 'Something went wrong while uploading profile image'
                });
            }        
        });
    }    
    const user = new User({
        name: req.body.name,
        surname: req.body.surname,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        address: req.body.address,
        type: req.body.type,
        avatarName: avatarName
    });
    user.save();    
    return res.json({
        success: true,
        msg: 'User registered successfully'
    });
}

const cart = (req: any, res: any) => {
    const user = {
        username: req.username,
        password: req.password,
        email: req.email
    }

    console.log(user);

    res.json({
        msg: 'Here i am at my cart!!!',
        user: user
    });
}

const profile = (req: any, res: any) => {
    const user = {
        username: req.username,
        password: req.password,
        email: req.email
    }

    console.log(user);

    res.json({
        msg: 'Here i am at my profile page!!!',
        user: user
    });
}

const userController: any = {
    register,
    login,
    cart,
    profile        
};

export {userController};