"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
var mongodb_1 = require("mongodb");
var moment_1 = __importDefault(require("moment"));
var cart_1 = __importDefault(require("../models/cart"));
var zeljene_potkategorije = {};
//helper funkcije.
//pronalazak vremena:
var findTime = function (bigger, smaller) {
    var bigg = moment_1.default(bigger);
    var small = moment_1.default(smaller);
    var sec = bigg.diff(small, 'seconds');
    var min = bigg.diff(small, 'minutes');
    var hours = bigg.diff(small, 'hours');
    var days = bigg.diff(small, 'days');
    var months = bigg.diff(small, 'months');
    var years = bigg.diff(small, 'years');
    if (sec != 0 && sec < 60)
        return sec + " seconds ago";
    if (min != 0 && min < 60)
        return min + " minutes ago";
    if (hours != 0 && hours < 24)
        return hours + " hours ago";
    if (days != 0 && days < 30)
        return days + " days ago";
    if (months != 0 && months < 12)
        return months + " months ago";
    if (sec == 0 && min == 0 && hours == 0 && days == 0 && months == 0 && years == 0)
        return 'a moment ago';
    return years + " years ago";
};
//rekurzivna za vraćanje kategorija
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
    if (images.length != undefined) {
        for (var i = 0; i < images.length; i++) {
            product['images'].push(product.name + uuid_1.v4() + path_1.default.extname(images[i].name));
        }
    }
    else {
        product['images'].push(product.name + uuid_1.v4() + path_1.default.extname(images.name));
    }
    product.save().then(function (product) { return __awaiter(void 0, void 0, void 0, function () {
        var i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(images.length != undefined)) return [3 /*break*/, 5];
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < product.images.length)) return [3 /*break*/, 4];
                    imageName = product.images[i];
                    upath = path_1.default.join(__dirname, '..', '/uploads/images/products', imageName);
                    return [4 /*yield*/, images[i].mv(upath, function (err) {
                            if (err) {
                                return res.json({
                                    success: false,
                                    msg: 'Something went wrong. Try again later'
                                });
                            }
                        })];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4: return [3 /*break*/, 7];
                case 5:
                    imageName = product.images[0];
                    upath = path_1.default.join(__dirname, '..', '/uploads/images/products', imageName);
                    return [4 /*yield*/, images.mv(upath, function (err) {
                            if (err) {
                                return res.json({
                                    success: false,
                                    msg: 'Something went wrong. Try again later'
                                });
                            }
                        })];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7: return [2 /*return*/];
            }
        });
    }); }).then(function () {
        return res.json({
            success: true,
            msg: 'Product added successfully'
        });
    })
        .catch(function (err) {
        console.log(err);
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
    if (kategorije == undefined || kategorije.length == 0) {
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
var getProduct = function (req, res) {
    //get product by its id:
    console.log(req.body.productID);
    var ID = new mongodb_1.ObjectID(req.body.productID);
    product_1.default
        .findById(ID)
        .lean()
        .then(function (product) {
        console.log(product);
        var vrijeme = new Date().toISOString();
        var ago = findTime(vrijeme, product === null || product === void 0 ? void 0 : product.date);
        res.json({
            success: true,
            msg: 'returned one object',
            product: product,
            ago: ago
        });
    });
};
var deleteProduct = function (req, res) {
    console.log(req.body);
    var product = JSON.parse(req.body.product);
    var images = product.images;
    var ID = new mongodb_1.ObjectID(product._id);
    //firstly, delete all the pictures of this product.
    for (var _i = 0, images_1 = images; _i < images_1.length; _i++) {
        var image = images_1[_i];
        var myPath = path_1.default.join(__dirname, '../uploads/images/products', image);
        if (fs_1.default.existsSync(myPath))
            fs_1.default.unlinkSync(myPath);
    }
    //then, delete product by ID.
    product_1.default
        .findByIdAndDelete(ID)
        .lean()
        .then(function (data) {
        console.log('Deleted product. Info that came: ');
        console.log(data);
        //now, delete product from every cart that it has been in        
        cart_1.default
            .deleteMany({ "product._id": product._id })
            .lean()
            .then(function (data1) {
            console.log('Deleted carts. Info that came: ');
            console.log(data1);
            //now, return json to the frontend
            res.json({
                success: true,
                msg: "deleted product by id",
                product: data
            });
        });
    });
};
var updateProduct = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var product, images, imageURLs, ID, _i, _a, image, upath, i, updateFilter;
    return __generator(this, function (_b) {
        product = JSON.parse(req.body.product);
        images = req.files.file;
        imageURLs = [];
        ID = new mongodb_1.ObjectID(product._id);
        //first and foremost, delete all the previous pictures of this product
        for (_i = 0, _a = product.images; _i < _a.length; _i++) {
            image = _a[_i];
            upath = path_1.default.join(__dirname, '../uploads/images/products', image);
            if (fs_1.default.existsSync(upath))
                fs_1.default.unlinkSync(upath);
        }
        if (images.length != undefined) {
            for (i = 0; i < images.length; i++) {
                imageURLs.push(product.name + uuid_1.v4() + path_1.default.extname(images[i].name));
            }
        }
        else {
            imageURLs.push(product.name + uuid_1.v4() + path_1.default.extname(images.name));
        }
        updateFilter = {
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
        product_1.default
            .findByIdAndUpdate(ID, { $set: updateFilter })
            .lean()
            .then(function (data) { return __awaiter(void 0, void 0, void 0, function () {
            var i, imageName, myPath, myPPath, updateFilter1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(images.length != undefined)) return [3 /*break*/, 5];
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < imageURLs.length)) return [3 /*break*/, 4];
                        imageName = imageURLs[i];
                        myPath = path_1.default.join(__dirname, '..', '/uploads/images/products', imageName);
                        return [4 /*yield*/, images[i].mv(myPath, function (err) {
                                if (err) {
                                    return res.json({
                                        success: false,
                                        msg: 'something went wrong when saving image of this product, please try again'
                                    });
                                }
                            })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [3 /*break*/, 7];
                    case 5:
                        myPPath = path_1.default.join(__dirname, '..', '/uploads/images/products', imageURLs[0]);
                        return [4 /*yield*/, images.mv(myPPath, function (err) {
                                if (err) {
                                    return res.json({
                                        success: false,
                                        msg: 'something went wrong when saving image of this product, please try again'
                                    });
                                }
                            })];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7:
                        console.log('Product update-ovan u produktima, rezultat:');
                        console.log(data);
                        updateFilter1 = {
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
                        cart_1.default
                            .updateMany({ 'product._id': product._id }, { $set: updateFilter1 })
                            .lean()
                            .then(function (data1) {
                            console.log('Produkt update-ovan u cartovima, rezultat:');
                            console.log(data1);
                        });
                        return [2 /*return*/];
                }
            });
        }); }).then(function () {
            return res.json({
                success: true,
                msg: 'Successfully updated my product',
                data: ""
            });
        });
        return [2 /*return*/];
    });
}); };
var productController = {
    updateProduct: updateProduct,
    deleteProduct: deleteProduct,
    add: add,
    sendProductPicture: sendProductPicture,
    category: category,
    getProduct: getProduct
};
exports.productController = productController;
