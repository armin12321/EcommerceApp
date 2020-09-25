"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsComponent = void 0;
var core_1 = require("@angular/core");
var ProductsComponent = /** @class */ (function () {
    function ProductsComponent(serverService, tokenService, flashMessages, router) {
        this.serverService = serverService;
        this.tokenService = tokenService;
        this.flashMessages = flashMessages;
        this.router = router;
    }
    ProductsComponent.prototype.ngOnInit = function () {
        if (this.tokenService.expiredToken()) {
            this.router.navigate(['/public/home']);
        }
        else {
            this.getData();
        }
    };
    ProductsComponent.prototype.getData = function () {
        var _this = this;
        this.serverService.getMyProducts().subscribe(function (data) {
            var css = 'alert-success';
            console.log(data);
            if (data.success == true) {
                _this.message = data.msg;
            }
            else {
                css = 'alert-danger';
                _this.router.navigate['/public/home'];
            }
            _this.flashMessages.show(data.msg, { cssClass: css, timeout: 3000 });
        });
    };
    ProductsComponent = __decorate([
        core_1.Component({
            selector: 'app-products',
            templateUrl: './products.component.html',
            styleUrls: ['./products.component.css']
        })
    ], ProductsComponent);
    return ProductsComponent;
}());
exports.ProductsComponent = ProductsComponent;
