"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeComponent = void 0;
var core_1 = require("@angular/core");
var HomeComponent = /** @class */ (function () {
    function HomeComponent(serverService, sanitizer, sharedData, router) {
        this.serverService = serverService;
        this.sanitizer = sanitizer;
        this.sharedData = sharedData;
        this.router = router;
        this.title = 'homepage';
        this.imageURLs = [];
    }
    HomeComponent.prototype.ngOnInit = function () {
        this.getData();
    };
    HomeComponent.prototype.ngAfterContentChecked = function () {
        var column = document.getElementById('column');
        if (column != null) { //ucitan je.
            this.resize();
        }
    };
    HomeComponent.prototype.setSellerID = function (productIndex) {
        this.sharedData.setSellerID(this.products[productIndex].product.user._id);
        this.router.navigate(['/public/sellerInfo']);
    };
    HomeComponent.prototype.setProductID = function (productIndex) {
        this.sharedData.setProductID(this.products[productIndex].product._id);
        this.router.navigate(['/public/productInfo']);
    };
    HomeComponent.prototype.getData = function () {
        var _this = this;
        this.serverService.getHomeData().subscribe(function (data) {
            console.log(data);
            _this.products = data.products;
            var _loop_1 = function (i) {
                //get url of first image in the array as avatar.
                var url = data.products[i].product.images[0];
                _this.imageURLs.push(''); // not to be undefined
                _this.getProductPicture(url).subscribe(function (picture) {
                    console.log(picture);
                    _this.imgPreview(picture, i);
                });
            };
            for (var i = 0; i < data.products.length; i++) {
                _loop_1(i);
            }
        });
    };
    HomeComponent.prototype.getProductPicture = function (url) {
        var wrapper = {
            url: url
        };
        return this.serverService.getProductPicture(wrapper);
    };
    HomeComponent.prototype.resize = function () {
        var column = document.getElementById('column');
        if (window.innerWidth < 1100) {
            if (!column.classList.contains('col-12'))
                column.classList.add('col-12');
            if (column.classList.contains('col-9'))
                column.classList.remove('col-9');
        }
        else {
            if (!column.classList.contains('col-9'))
                column.classList.add('col-9');
            if (column.classList.contains('col-12'))
                column.classList.remove('col-12');
        }
    };
    HomeComponent.prototype.imgPreview = function (img, index) {
        var _this = this;
        var reader = new FileReader();
        reader.readAsDataURL(img);
        reader.onload = function (_event) {
            _this.imageURLs[index] = _this.sanitizer.bypassSecurityTrustUrl("" + reader.result);
        };
    };
    HomeComponent.prototype.imageStyle = function () {
        return {
            'border-radius': '50px'
        };
    };
    HomeComponent = __decorate([
        core_1.Component({
            selector: 'app-home',
            templateUrl: './home.component.html',
            styleUrls: ['./home.component.css']
        })
    ], HomeComponent);
    return HomeComponent;
}());
exports.HomeComponent = HomeComponent;
