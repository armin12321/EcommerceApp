//functions:
import Product, {IProduct} from '../models/product'
import moment from 'moment';


const home = (req: any, res: any) => {
    let test = req.headers['x-access-token'];

    //return all possible products sorted by the date
    Product
    .find()
    .sort({date: -1})
    .lean()
    .limit(5)
    .then((products) => {
        //for each product, find difference in time of getting information, and setting product
        let dateToday: string = new Date().toISOString();
        
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

    let findTime = (bigger: any, smaller: any) => {
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

const about = (req: any, res: any) => {
    res.json({
        success: true,
        msg: 'Served about page for our website'
    });   
}

//objects:
const publicController: any = {
    home,
    about
};

export {publicController};