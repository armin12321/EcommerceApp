import path from 'path';
import User, { IUser } from '../models/user';
import Product, { IProduct } from '../models/product';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import { ObjectID } from 'mongodb';
import moment from 'moment';
import Cart from '../models/cart';

let zeljene_potkategorije: any = {};

//helper funkcije.
//pronalazak vremena:
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
    if (sec == 0 && min == 0 && hours == 0 && days == 0 && months == 0 && years == 0)
        return 'a moment ago';
    return `${years} years ago`;
};

//rekurzivna za vraćanje kategorija
function nadjiPotKategorije (kategorijeFrontend: Array<any>, kategorijeOlx: Array<any>, pocetnaKategorija: any, trazenaKategorija: any):any {
    //ako smo naišli na kliknutu kategoriju    
    if (pocetnaKategorija == trazenaKategorija) {

        for (const kategorijaOlx of kategorijeOlx) {

            if (pocetnaKategorija == kategorijaOlx.naziv) {
                if (kategorijaOlx.potkategorije != undefined)
                    zeljene_potkategorije = kategorijaOlx.potkategorije;
                else
                    //ako nema više kategorija, vrati prazno, pa se oni lahko mogu vratiti putem breadcrumba.
                    zeljene_potkategorije = [];
                
                return;
            }           
        }

        //ako kategorija ne postoji
        zeljene_potkategorije = [];
        return;
    }

    let index: number = -1;

    //nadji indeks pocetne kategorije u olx kategoriji
    for (let i = 0; i < kategorijeOlx.length; i++) {
        if (kategorijeOlx[i].naziv == pocetnaKategorija) {
            index = i;
            break;
        }
    }

    //ako smo unijeli kategoriju koja ne postoji, vrati trenutnu kategoriju
    if (index == -1) {
        zeljene_potkategorije = kategorijeOlx;
        return;
    }

    //pop front-end kategoriju
    kategorijeFrontend.shift();
    
    //kategorijeOlx su sada potkategorije trenutne kategorije
    kategorijeOlx = kategorijeOlx[index].potkategorije;

    //nova pocetna kategorija je sada prvi element modifikovane frontend kategorije
    pocetnaKategorija = kategorijeFrontend[0];

    nadjiPotKategorije(kategorijeFrontend, kategorijeOlx, pocetnaKategorija, trazenaKategorija);
};

//functions:

const add = (req: any, res: any) => {
    console.log(req.body);
    let categories = JSON.parse(req.body.categories)
    let infoObjects = JSON.parse(req.body.infoObjects);

    console.log(categories);
    console.log(infoObjects);

    let upath, imageName;       

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
        description: req.body.description,
        manufacturer: req.body.manufacturer,
        categories: categories,
        infoObjects: infoObjects
    });    

    if (images.length != undefined) {
        for (let i = 0; i < images.length; i++){
            product['images'].push(product.name + uuidv4() + path.extname(images[i].name));
        }
    } else {
        product['images'].push(product.name + uuidv4() + path.extname(images.name));
    }

    product.save().then(async (product) => {
        if (images.length != undefined) {
            for (let i = 0; i < product.images.length; i++){
                imageName = product.images[i];            
                upath = path.join(__dirname, '..', '/uploads/images/products', imageName);

                await images[i].mv(upath, (err: any) => {
                    if (err){
                        return res.json({
                            success: false,
                            msg: 'Something went wrong. Try again later'
                        });
                    }
                });
            }    

        } else {
            imageName = product.images[0];
            upath = path.join(__dirname, '..', '/uploads/images/products', imageName);

            await images.mv(upath, (err: any) => {
                if (err){
                    return res.json({
                        success: false,
                        msg: 'Something went wrong. Try again later'
                    });
                }
            });
        }

        res.json({
            success: true,
            msg: 'Product added successfully'
        });        
    }).catch((err) => {
        console.log(err);
    });
};

const sendProductPicture = (req: any, res: any) => {
    console.log(req.body.url);
    const pathToPicture: string = path.join(__dirname, '..', 'uploads/images/products', req.body.url);     
    res.sendFile(pathToPicture);
};

const category = (req: any, res: any) => {
    console.log(req.body);

    const pathToJSON = '/home/armin69/MEAN_stack/EcommerceApp/Backend/uploads/JSON/kategorije.json';
    let kategorijeJSON = JSON.parse(fs.readFileSync(pathToJSON).toString());

    const kategorije = req.body.kategorije;
    const kategorijeOlx: Array<any> = kategorijeJSON.kategorije;

    let JSONResponse: any = {
        success: true,
        msg: 'uspješno vraćene sve kategorije',
        kategorije: []
    };



    if (kategorije == undefined || kategorije.length == 0) {

        kategorijeJSON.msg = 'uspješno vraćene sve kategorije';

        for (const kategorija of kategorijeOlx) {
            JSONResponse.kategorije.push({
                id: kategorija.id,
                naziv: kategorija.naziv
            });
        }

        res.json(JSONResponse);
    } else {
        nadjiPotKategorije(kategorije, kategorijeOlx, kategorije[0], kategorije[kategorije.length - 1]);

        console.log('Nađene potkategorije su : ');
        console.log(zeljene_potkategorije);

        let response: any = {
            success: true,
            msg: 'vraćene potkategorije',
            kategorije: []
        };

        for (const kategorija of zeljene_potkategorije) {
            response.kategorije.push({
                id: kategorija.id,
                naziv: kategorija.naziv
            });
        }

        res.json(response);
    }
};

const getProduct = (req: any ,res: any) => {
    //get product by its id:
    console.log(req.body.productID);
    let ID: ObjectID = new ObjectID(req.body.productID);

    Product
    .findById(ID)
    .lean()
    .then((product) => {
        console.log(product);
        let vrijeme = new Date().toISOString();

        let ago = findTime(vrijeme, product?.date);

        res.json({
            success: true,
            msg: 'returned one object',
            product: product,
            ago: ago
        })
    })
}

const deleteProduct = (req: any, res: any) => {
    console.log(req.body);
    let product: any = JSON.parse(req.body.product);
    let images: Array<any> = product.images;
    let ID: ObjectID = new ObjectID(product._id);

    //firstly, delete all the pictures of this product.
    for (let image of images) {
        let myPath = path.join(__dirname, '../uploads/images/products', image);
        if (fs.existsSync(myPath)) fs.unlinkSync(myPath);
    }

    //then, delete product by ID.
    Product
    .findByIdAndDelete(ID)
    .lean()
    .then((data) => {
        console.log('Deleted product. Info that came: ');
        console.log(data);

        //now, delete product from every cart that it has been in        
        Cart
        .deleteMany({"product._id": product._id})
        .lean()
        .then((data1) => {
            console.log('Deleted carts. Info that came: ');
            console.log(data1);

            //now, return json to the frontend
            res.json({
                success: true,
                msg: "deleted product by id",
                product: data
            });
        })
    })
};

const updateProduct = async (req: any, res: any) => {
    const product: any = JSON.parse(req.body.product);
    const images: any = req.files.file;
    let imageURLs: Array<string> = [];
    const ID: ObjectID = new ObjectID(product._id);

    //first and foremost, delete all the previous pictures of this product
    for (let image of product.images) {
        const upath = path.join(__dirname, '../uploads/images/products', image);
        if (fs.existsSync(upath))
            fs.unlinkSync(upath);
    }

    //make new picture names for new pictures
    if (images.length != undefined) {
        for (let i = 0; i < images.length; i++) {
            imageURLs.push(product.name + uuidv4() + path.extname(images[i].name));
        }

        //save new pictures with new names on the server
        for (let i = 0; i < imageURLs.length; i++) {
            const imageName = imageURLs[i];
            const myPath = path.join(__dirname, '..', '/uploads/images/products', imageName);

            await images[i].mv(myPath, (err: any) => {
                if (err) {
                    res.json({
                        success: false,
                        msg: 'something went wrong when saving image of this product, please try again'
                    });
                }
            })
        }
    } else {
        imageURLs.push(product.name + uuidv4() + path.extname(images.name));
        const myPPath = path.join(__dirname, '..', '/uploads/images/products', imageURLs[0]);

        await images.mv(myPPath, (err: any) => {
           if (err) {
               res.json({
                   success: false,
                   msg: 'something went wrong when saving image of this product, please try again'
               });
           } 
        });
    }

    const updateFilter = {
        available: product.available,
        categories: product.categories,
        condition: product.condition,
        date: new Date(),
        description: product.description,
        images: imageURLs,
        infoObjects: product.infoObjects,
        manufacturer: product.manufacturer,
        name: product.name,
        price: product.price,
    };

    //then, update values in product collection
    Product
    .findByIdAndUpdate(ID, {$set: updateFilter})
    .lean()
    .then((data) => {
        console.log('Product update-ovan u produktima, rezultat:');
        console.log(data);

        const updateFilter1 = {
            "product.available": product.available,
            "product.categories": product.categories,
            "product.condition": product.condition,
            "product.date": new Date(),
            "product.description": product.description,
            "product.images": imageURLs,
            "product.infoObjects": product.infoObjects,
            "product.manufacturer": product.manufacturer,
            "product.name": product.name,
            "product.price": product.price
        };  

        //then, update values for cart collection
        Cart
        .updateMany({'product._id': product._id}, {$set: updateFilter1})
        .lean()
        .then((data1) => {
            console.log('Produkt update-ovan u cartovima, rezultat:');
            console.log(data1);

            //send response to the frontend
            res.json({
                success: true,
                msg: 'successfully updated product',
                product: data1
            });
        })
    })        
};

const productController: any = {
    updateProduct,
    deleteProduct,
    add,
    sendProductPicture,
    category,
    getProduct
};

export { productController };