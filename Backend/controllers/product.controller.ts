import path from 'path';
import User, { IUser } from '../models/user';
import Product, { IProduct } from '../models/product';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { serverConfig } from '../configs/server.config';
import { dbConfig } from '../configs/db.config';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

let zeljene_potkategorije: any = {};

//helper funkcije.
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

    for (let i = 0; i < images.length; i++){
        product['images'].push(product.name + uuidv4() + path.extname(images[i].name));
    }

    product.save().then((product) => {
        for (let i = 0; i < images.length; i++){
            imageName = product.images[i];
            // imageName = product.id + '-' + i.toString() + path.extname(images[i].name); Ima i ova varijanta davanja imena.
            upath = path.join(__dirname, '..', '/uploads/images/products', imageName);
            images[i].mv(upath, (err: any) => {
                if (err){
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

    if (kategorije.length == 0 || kategorije == undefined) {

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

const productController: any = {
    add,
    sendProductPicture,
    category
};

export { productController };