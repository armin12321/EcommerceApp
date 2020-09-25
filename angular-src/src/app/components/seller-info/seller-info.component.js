"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SellerInfoComponent = void 0;
var core_1 = require("@angular/core");
var SellerInfoComponent = /** @class */ (function () {
    function SellerInfoComponent(sanitizer, serverService, sharedData, router, navbarService, tokenService) {
        this.sanitizer = sanitizer;
        this.serverService = serverService;
        this.sharedData = sharedData;
        this.router = router;
        this.navbarService = navbarService;
        this.tokenService = tokenService;
        this.user = {};
        this.avatarURL = "";
        this.products = [];
        this.imageURLs = [];
    }
    SellerInfoComponent.prototype.ngOnInit = function () {
        this.getData();
    };
    SellerInfoComponent.prototype.ngAfterContentChecked = function () {
        //Here change some of the classes to display nicely
        var avatarImage = document.getElementById('avatarImage');
        var userInfo = document.getElementById('info');
        if (avatarImage != null && userInfo != null) { //loaded
            this.resize();
        }
    };
    SellerInfoComponent.prototype.Chat = function () {
        this.sharedData.setChatPersonUsername(this.user.username);
        this.sharedData.setChatPersonID(this.user._id);
        this.router.navigate(['/user/chat']);
    };
    SellerInfoComponent.prototype.sameUser = function () {
        if (this.user._id == this.tokenService.getUser()._id)
            return true;
        return false;
    };
    SellerInfoComponent.prototype.getData = function () {
        var _this = this;
        //firstly, get data about the seller
        var wrapper = {
            _id: this.sharedData.getSellerID()
        };
        this.serverService.getSellerData(wrapper).subscribe(function (data) {
            console.log(data);
            if (data.success) {
                _this.user = data.user; // this is gonna display in html.
                _this.sharedData.setChatPersonAvatarURL(_this.user.avatarName);
                _this.getAvatarImage(_this.user.avatarName).subscribe(function (picture) {
                    _this.imgPreview(picture);
                });
                //We will return top 10 most purchased products of this seller.
                _this.serverService.getTopProducts(wrapper).subscribe(function (data) {
                    console.log(data);
                    _this.products = data.products;
                    var _loop_1 = function (i) {
                        //get url of first image in the array as avatar.
                        var url = data.products[i].product.images[0];
                        _this.imageURLs.push(''); // not to be undefined
                        _this.getProductPicture(url).subscribe(function (picture) {
                            console.log(picture);
                            _this.imgPreview1(picture, i);
                        });
                    };
                    for (var i = 0; i < data.products.length; i++) {
                        _loop_1(i);
                    }
                });
            }
            else {
                console.log(data.msg);
            }
        });
    };
    SellerInfoComponent.prototype.getProductPicture = function (url) {
        return this.serverService.getProductPicture({ url: url });
    };
    SellerInfoComponent.prototype.getAvatarImage = function (avatarName) {
        return this.serverService.getAvatarImage({ avatarName: avatarName });
    };
    SellerInfoComponent.prototype.setProductID = function (productIndex) {
        this.sharedData.setProductID(this.products[productIndex].product._id);
        this.router.navigate(['/public/productInfo']);
    };
    SellerInfoComponent.prototype.resize = function () {
        //resize event handler - for displaying nicely.
        var column = document.getElementById('avatarImage');
        if (window.innerWidth < 600) {
            if (!column.classList.contains('col-12'))
                column.classList.add('col-12');
            if (column.classList.contains('col-6'))
                column.classList.remove('col-6');
        }
        else {
            if (!column.classList.contains('col-6'))
                column.classList.add('col-6');
            if (column.classList.contains('col-12'))
                column.classList.remove('col-12');
        }
        column = document.getElementById('info');
        if (window.innerWidth < 600) {
            if (!column.classList.contains('col-12'))
                column.classList.add('col-12');
            if (column.classList.contains('col-6'))
                column.classList.remove('col-6');
        }
        else {
            if (!column.classList.contains('col-6'))
                column.classList.add('col-6');
            if (column.classList.contains('col-12'))
                column.classList.remove('col-12');
        }
    };
    SellerInfoComponent.prototype.imgPreview = function (img) {
        var _this = this;
        var reader = new FileReader();
        reader.readAsDataURL(img);
        reader.onload = function (_event) {
            _this.avatarURL = _this.sanitizer.bypassSecurityTrustUrl("" + reader.result);
        };
    };
    SellerInfoComponent.prototype.pictureStyle = function () {
        return {
            'border-radius': '120px 20px 120px 20px'
        };
    };
    SellerInfoComponent.prototype.imgPreview1 = function (img, index) {
        var _this = this;
        var reader = new FileReader();
        reader.readAsDataURL(img);
        reader.onload = function (_event) {
            _this.imageURLs[index] = _this.sanitizer.bypassSecurityTrustUrl("" + reader.result);
        };
    };
    SellerInfoComponent = __decorate([
        core_1.Component({
            selector: 'app-seller-info',
            templateUrl: './seller-info.component.html',
            styleUrls: ['./seller-info.component.css']
        })
    ], SellerInfoComponent);
    return SellerInfoComponent;
}());
exports.SellerInfoComponent = SellerInfoComponent;
