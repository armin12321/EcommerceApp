import path from 'path';
import User, { IUser } from '../models/user';
import Product, { IProduct } from '../models/product';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { serverConfig } from '../configs/server.config';
import { dbConfig } from '../configs/db.config';
import { ObjectID } from 'mongodb';

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
                    _id: user._id,
                    type: user.type            
                }, serverConfig.SECRET, {expiresIn: 86400});   //one day.

                let modifiedUser: any = {
                    address: user.address,
                    avatarName: user.avatarName,
                    email: user.email,
                    name: user.name,
                    surname: user.surname,
                    type: user.type,
                    username: user.username,
                    _id: user._id,
                };

                res.json({
                    token: token,
                    success: true,
                    msg: 'Succesfuly logged in',
                    user: modifiedUser                    
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

const register = async (req: any, res: any) => {
    let avatarName;        
    let uploaded: boolean;
    const user = new User({
        name: req.body.name,
        surname: req.body.surname,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        address: req.body.address,
        type: req.body.type,
        avatarName: 'default.jpg',
        online: true,
        lastTimeOnline: new Date()
    });
    if (req.files){
        let sampleFile = req.files.file;
        const ext = path.extname(sampleFile.name);
        avatarName = req.body.username + ext;
        let uploadPath = path.join(__dirname, '..', '/uploads/images/avatars/', avatarName);
        user.avatarName = avatarName;
        uploaded = await sampleFile.mv(uploadPath, (err:any) => {
            if (err) {
                return res.json({
                    success: false,
                    msg: 'Something went wrong. Try again later'
                });
            }else {
                user.save().then((data) => {
                    return res.json({
                        success: true,
                        msg: 'User successfully registered. You can now log in'
                    }); 
                });        
            }
        });
    }else {
        user.save().then((data) => {
            return res.json({
                success: true,
                msg: 'User successfully registered. You can now log in'
            }) 
        });
    }
}

const cart = (req: any, res: any) => {
    //if i'm not buyer, what do i need cart for then?
    if (req.user_type == dbConfig.user_type.SELLER) {
        res.json({
            success: false,
            msg: 'not a buyer',
            user: null
        });
    } else {
        const user = {
            username: req.username,
            _id: req.user_id,
            type: req.user_type
        };
    
        console.log(user);
    
        res.json({
            success: true,
            msg: 'Here I am at my cart.',
            user: user
        });
    }
}

const profile = (req: any, res: any) => {
    const user = {
        username: req.username,
        _id: req.user_id,
        type: req.user_type
    };

    console.log(user);

    res.json({
        success: true,
        msg: 'Here i am at my profile page.',
        user: user
    });
}

const products = (req: any, res: any) => {
    //if i'm not seller, i cannot have products page :
    if (req.user_type == dbConfig.user_type.BUYER) {
        res.json({
            success: false,
            msg: 'not a seller',
            products: null
        });
    } else {
        const user = {
            username: req.username,
            _id: req.user_id,
            user_type: req.user_type 
        }
        const products: any = {};
        res.json({
            success: true,
            msg: 'Here i am at my products.',
            products: products
        });
    }
};

const getByID = (req: any, res: any) => {
    //here getting req.body.ID
    console.log(req.body.id);
    let id = new ObjectID(req.body.id);
    
    User
    .findById(id)
    .lean()
    .then((user) => {
        console.log(user);
        res.json({
            success: true,
            avatarName: user?.avatarName,
            msg: 'Successfully returned by ID'
        });
    });
};

const userController: any = {
    getByID,
    register,
    login,
    cart,
    profile,
    products        
};

export {userController};