//functions:
import Product from '../models/product';
import moment from 'moment';
import User from '../models/user';
import path from 'path';
import { ObjectID } from 'mongodb';
const home = (req, res) => {
    //return all possible products sorted by the date
    Product
        .find({})
        .sort({ date: -1 })
        .lean()
        .limit(18)
        .then((products) => {
        //for each product, find difference in time of getting information, and setting product
        let dateToday = new Date().toISOString();
        let modifiedProducts = products.map((product) => {
            let ago = findTime(dateToday, product.date);
            return {
                product,
                ago
            };
        });
        res.json({
            success: true,
            msg: 'Served main page for our website.',
            products: modifiedProducts,
        });
    });
    let findTime = (bigger, smaller) => {
        let bigg = moment(bigger);
        let small = moment(smaller);
        let sec = bigg.diff(small, 'seconds');
        let min = bigg.diff(small, 'minutes');
        let hours = bigg.diff(small, 'hours');
        let days = bigg.diff(small, 'days');
        let months = bigg.diff(small, 'months');
        let years = bigg.diff(small, 'years');
        if (sec != 0 && sec < 60)
            return `${sec} seconds ago`;
        if (min != 0 && min < 60)
            return `${min} minutes ago`;
        if (hours != 0 && hours < 24)
            return `${hours} hours ago`;
        if (days != 0 && days < 30)
            return `${days} days ago`;
        if (months != 0 && months < 12)
            return `${months} months ago`;
        return `${years} years ago`;
    };
};
const about = (req, res) => {
    res.json({
        success: true,
        msg: 'Served about page for our website'
    });
};
const sellerInfo = (req, res) => {
    console.log(req.body._id);
    User
        .findById(req.body._id)
        .lean()
        .then((user) => {
        console.log(user);
        let wrapper = {
            avatarName: user === null || user === void 0 ? void 0 : user.avatarName,
            username: user === null || user === void 0 ? void 0 : user.username,
            name: user === null || user === void 0 ? void 0 : user.name,
            surname: user === null || user === void 0 ? void 0 : user.surname,
            address: user === null || user === void 0 ? void 0 : user.address,
            email: user === null || user === void 0 ? void 0 : user.email,
            _id: user === null || user === void 0 ? void 0 : user._id
        };
        res.json({
            success: true,
            msg: 'Served seller info',
            user: wrapper
        });
    });
};
const productInfo = (req, res) => {
    res.json({});
};
const avatarImage = (req, res) => {
    console.log(req.body.avatarName);
    res.sendFile(path.join(__dirname, '..', 'uploads', 'images', 'avatars', req.body.avatarName));
};
const topProducts = (req, res) => {
    let id = new ObjectID(req.body._id);
    Product
        .find({ "user._id": id })
        .sort({ purchased: -1, date: -1 })
        .lean()
        .limit(10)
        .then((products) => {
        let dateToday = new Date().toISOString();
        let modifiedProducts = products.map((product) => {
            let ago = findTime(dateToday, product.date);
            return {
                product,
                ago
            };
        });
        res.json({
            success: true,
            msg: 'Served main page for our website.',
            products: modifiedProducts,
        });
    });
    let findTime = (bigger, smaller) => {
        let bigg = moment(bigger);
        let small = moment(smaller);
        let sec = bigg.diff(small, 'seconds');
        let min = bigg.diff(small, 'minutes');
        let hours = bigg.diff(small, 'hours');
        let days = bigg.diff(small, 'days');
        let months = bigg.diff(small, 'months');
        let years = bigg.diff(small, 'years');
        if (sec != 0 && sec < 60)
            return `${sec} seconds ago`;
        if (min != 0 && min < 60)
            return `${min} minutes ago`;
        if (hours != 0 && hours < 24)
            return `${hours} hours ago`;
        if (days != 0 && days < 30)
            return `${days} days ago`;
        if (months != 0 && months < 12)
            return `${months} months ago`;
        return `${years} years ago`;
    };
};
//objects:
const publicController = {
    home,
    about,
    sellerInfo,
    productInfo,
    avatarImage,
    topProducts
};
export { publicController };
