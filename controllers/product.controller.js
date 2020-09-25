import path from 'path';
import User from '../models/user';
import Product from '../models/product';
import { v4 as uuidv4 } from 'uuid';
//functions:
const add = (req, res) => {
    let avatarName, upath, imageName;
    let pass = true;
    let uploaded;
    console.log(req.body.name);
    console.log(req.files.file);
    const images = req.files.file;
    const user = new User(JSON.parse(req.body.user));
    const product = new Product({
        name: req.body.name[1],
        user: user,
        price: req.body.price,
        available: req.body.available,
        condition: req.body.condition,
        purchased: 0,
        date: new Date().toISOString(),
        images: [],
        description: req.body.description
    });
    for (let i = 0; i < images.length; i++) {
        product['images'].push(product.name + uuidv4() + path.extname(images[i].name));
    }
    product.save().then((product) => {
        for (let i = 0; i < images.length; i++) {
            imageName = product.images[i];
            // imageName = product.id + '-' + i.toString() + path.extname(images[i].name); Ima i ova varijanta davanja imena.
            upath = path.join(__dirname, '..', '/uploads/images/products', imageName);
            images[i].mv(upath, (err) => {
                if (err) {
                    return res.json({
                        success: false,
                        msg: 'Something went wrong. Try again later'
                    });
                }
            });
        }
    }).catch((err) => {
        console.log(err);
    });
    return res.json({
        success: true,
        msg: 'Product added successfully'
    });
};
const sendProductPicture = (req, res) => {
    console.log(req.body.url);
    const pathToPicture = path.join(__dirname, '..', 'uploads/images/products', req.body.url);
    res.sendFile(pathToPicture);
};
const productController = {
    add,
    sendProductPicture
};
export { productController };
