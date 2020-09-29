"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productController = void 0;
var path_1 = __importDefault(require("path"));
var user_1 = __importDefault(require("../models/user"));
var product_1 = __importDefault(require("../models/product"));
var uuid_1 = require("uuid");
var fs_1 = __importDefault(require("fs"));
var zeljene_potkategorije = {};
//helper funkcije.
function nadjiPotKategorije(kategorijeFrontend, kategorijeOlx, pocetnaKategorija, trazenaKategorija) {
    //ako smo naišli na kliknutu kategoriju    
    if (pocetnaKategorija == trazenaKategorija) {
        for (var _i = 0, kategorijeOlx_1 = kategorijeOlx; _i < kategorijeOlx_1.length; _i++) {
            var kategorijaOlx = kategorijeOlx_1[_i];
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
    var index = -1;
    //nadji indeks pocetne kategorije u olx kategoriji
    for (var i = 0; i < kategorijeOlx.length; i++) {
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
}
;
//functions:
var add = function (req, res) {
    console.log(req.body);
    var categories = JSON.parse(req.body.categories);
    var infoObjects = JSON.parse(req.body.infoObjects);
    console.log(categories);
    console.log(infoObjects);
    var upath, imageName;
    console.log(req.body.name);
    console.log(req.files.file);
    var images = req.files.file;
    var user = new user_1.default(JSON.parse(req.body.user));
    var product = new product_1.default({
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
    for (var i = 0; i < images.length; i++) {
        product['images'].push(product.name + uuid_1.v4() + path_1.default.extname(images[i].name));
    }
    product.save().then(function (product) {
        for (var i = 0; i < images.length; i++) {
            imageName = product.images[i];
            // imageName = product.id + '-' + i.toString() + path.extname(images[i].name); Ima i ova varijanta davanja imena.
            upath = path_1.default.join(__dirname, '..', '/uploads/images/products', imageName);
            images[i].mv(upath, function (err) {
                if (err) {
                    return res.json({
                        success: false,
                        msg: 'Something went wrong. Try again later'
                    });
                }
            });
        }
    }).catch(function (err) {
        console.log(err);
    });
    return res.json({
        success: true,
        msg: 'Product added successfully'
    });
};
var sendProductPicture = function (req, res) {
    console.log(req.body.url);
    var pathToPicture = path_1.default.join(__dirname, '..', 'uploads/images/products', req.body.url);
    res.sendFile(pathToPicture);
};
var category = function (req, res) {
    console.log(req.body);
    var pathToJSON = '/home/armin69/MEAN_stack/EcommerceApp/Backend/uploads/JSON/kategorije.json';
    var kategorijeJSON = JSON.parse(fs_1.default.readFileSync(pathToJSON).toString());
    var kategorije = req.body.kategorije;
    var kategorijeOlx = kategorijeJSON.kategorije;
    var JSONResponse = {
        success: true,
        msg: 'uspješno vraćene sve kategorije',
        kategorije: []
    };
    if (kategorije.length == 0 || kategorije == undefined) {
        kategorijeJSON.msg = 'uspješno vraćene sve kategorije';
        for (var _i = 0, kategorijeOlx_2 = kategorijeOlx; _i < kategorijeOlx_2.length; _i++) {
            var kategorija = kategorijeOlx_2[_i];
            JSONResponse.kategorije.push({
                id: kategorija.id,
                naziv: kategorija.naziv
            });
        }
        res.json(JSONResponse);
    }
    else {
        nadjiPotKategorije(kategorije, kategorijeOlx, kategorije[0], kategorije[kategorije.length - 1]);
        console.log('Nađene potkategorije su : ');
        console.log(zeljene_potkategorije);
        var response = {
            success: true,
            msg: 'vraćene potkategorije',
            kategorije: []
        };
        for (var _a = 0, zeljene_potkategorije_1 = zeljene_potkategorije; _a < zeljene_potkategorije_1.length; _a++) {
            var kategorija = zeljene_potkategorije_1[_a];
            response.kategorije.push({
                id: kategorija.id,
                naziv: kategorija.naziv
            });
        }
        res.json(response);
    }
};
var productController = {
    add: add,
    sendProductPicture: sendProductPicture,
    category: category
};
exports.productController = productController;
