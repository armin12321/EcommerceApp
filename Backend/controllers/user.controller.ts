import path from 'path';
import User, { IUser } from '../models/user';
import Cart, { ICart } from '../models/cart';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { serverConfig } from '../configs/server.config';
import { dbConfig } from '../configs/db.config';
import { ObjectID } from 'mongodb';
import Product from '../models/product';
import fs from 'fs';

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
        const ID: ObjectID = new ObjectID(req.user_id);

        const filter = {
            user_id: ID
        };

        Cart
        .find(filter)
        .lean()
        .sort({time: 1})
        .then((carts) => {
            res.json({
                success: true,
                msg: 'returned cart data',
                carts: carts
            });
        })
    }
}

const profile = (req: any, res: any) => {
    let ID: ObjectID = new ObjectID(req.user_id);

    User
    .findById(ID)
    .lean()
    .then((u) => {
        const user = {
            username: u?.username,
            name: u?.name,
            surname: u?.surname,
            email: u?.email,
            address: u?.address,
            type: u?.type,
            avatarName: u?.avatarName
        };

        res.json({
            success: true,
            user: user,
            msg: 'successfully returned user'
        });
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

const addToCart = (req: any, res: any) => {
  console.log('evo mene u addToCart');
  console.log(req.body);

  let ID: ObjectID = new ObjectID(req.user_id);

  let filter = {
      user_id: ID,
      product: req.body.product
  };

  Cart
  .findOne(filter)
  .lean()
  .then((cart) => {
      if (cart != undefined) {
          res.json({
            msg: 'already exists',
            success: true
          });
      } else {
        let cart = new Cart({
            user_id: req.user_id,
            product: req.body.product,
            quantity: req.body.quantity,
            time: new Date()
          });
        
          cart
          .save()
          .then((product) => {
              console.log(product);
              res.json({
                  success: true,
                  msg: 'Uspješno dodano u košaricu',
                  product: product
              });
          });
      }
  });
};


const deleteFromCart = (req: any, res: any) => {
    const ID: ObjectID = new ObjectID(req.body.ID);

    Cart
    .findByIdAndDelete(ID)
    .lean()
    .then((cart) => {
        res.json({
            success: true,
            msg: 'deleted cart by id',
            deletedCart: cart
        });
    })
};

const updateCartQuantity = (req: any, res: any) => {
    const ID: ObjectID = new ObjectID(req.body.ID);
    const quantity: number = req.body.quantity;

    const filter = {
        $set: {
            quantity: quantity
        }
    };

    Cart
    .findByIdAndUpdate(ID, filter)
    .lean()
    .then((cart) => {
        res.json({
            success: true,
            msg: 'updated with id',
            updatedCart: cart
        });
    });
};

const updateInfo = async (req: any, res: any) => {    
    let ID: ObjectID = new ObjectID(req.user_id);
    let newFile:any = undefined;

    if (req.files)
        newFile = req.files.file;
    
    let avatarName = req.body.previousAvatar;

    if (newFile != undefined)
        avatarName = req.body.username + path.extname(newFile.name);

    console.log(req.body);

    const filter = {
        name: req.body.name,
        username: req.body.username,
        surname: req.body.surname,
        email: req.body.email,
        address: req.body.address,
        avatarName: avatarName
    };

    //update user in User collection
    User
    .findByIdAndUpdate(ID, {$set: filter})
    .lean()
    .then(async (user) => {
        console.log('Updated user:');
        console.log(user);

        if (req.user_type == dbConfig.user_type.SELLER) {
            //Update user in all of the products of that seller:
            const filter1 = {
                "user.name": req.body.name,
                "user.username": req.body.username,
                "user.surname": req.body.surname,
                "user.email": req.body.email,
                "user.address": req.body.address,
                "user.avatarName": avatarName
            };

            Product
            .updateMany({"user._id": ID}, {$set: filter1})
            .lean()
            .then((product) => {
                console.log('Updated product(s):');

                if (product != undefined)
                    console.log(product);
                
                //Update user in all of the cart documents
                const filter2 = {
                    "product.user.name": req.body.name,
                    "product.user.username": req.body.username,
                    "product.user.surname": req.body.surname,
                    "product.user.address": req.body.address,
                    "product.user.email": req.body.email,
                    "product.user.avatarName": avatarName
                };

                Cart
                .updateMany({"product.user._id": req.user_id}, {$set: filter2})
                .lean()
                .then(async (carts) => {
                    console.log('Updated cart(s):');
                    if (carts != undefined)
                        console.log(carts);                        

                    //Update profile picture of this user
                    if (newFile != null) { 
                        //izbriši staru sliku ako postoji
                        if (req.body.previousAvatar != 'default.jpg' && fs.existsSync(path.join(__dirname, '../uploads/images/avatars', req.body.previousAvatar)))
                            fs.unlinkSync(path.join(__dirname, '../uploads/images/avatars', req.body.previousAvatar));

                        //snimi na disk novu sliku
                        let uploadPath = path.join(__dirname, '..', '/uploads/images/avatars/', avatarName);
                        
                        await newFile.mv(uploadPath, (err:any) => {
                            if (err) {
                                res.json({
                                    success: false,
                                    msg: 'Something went wrong. Try again later'
                                });
                            }else {
                                return res.json({
                                    success: true,
                                    msg: 'successfully updated user in user database.',
                                    user: user
                                });            
                            }
                        });
                    } else {
                        res.json({
                            success: true,
                            msg: 'successfully updated user in user database.',
                            user: user
                        });
                    }   
                })
            });
        } else {
            //provjeriti da li je potrebno da slike uploadujemo

            if (newFile != null) { 
                //izbriši staru sliku ako postoji
                if (req.body.previousAvatar != 'default.jpg' && fs.existsSync(path.join(__dirname, '../uploads/images/avatars', req.body.previousAvatar)))
                    fs.unlinkSync(path.join(__dirname, '../uploads/images/avatars', req.body.previousAvatar));

                //snimi na disk novu sliku
                let uploadPath = path.join(__dirname, '..', '/uploads/images/avatars/', avatarName);
                
                await newFile.mv(uploadPath, (err:any) => {
                    if (err) {
                        res.json({
                            success: false,
                            msg: 'Something went wrong. Try again later'
                        });
                    }else {
                        res.json({
                            success: true,
                            msg: 'successfully updated user in user database.',
                            user: user
                        });            
                    }
                });
            } else {
                res.json({
                    success: true,
                    msg: 'successfully updated user in user database.',
                    user: user
                });           
            }
        }
    })    
};

const userController: any = {
    updateInfo,
    getByID,
    register,
    login,
    cart,
    profile,
    products,
    addToCart,
    deleteFromCart,
    updateCartQuantity
};

export {userController};