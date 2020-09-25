"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartComponent = void 0;
var core_1 = require("@angular/core");
var CartComponent = /** @class */ (function () {
    function CartComponent(serverService, flashMessages, router, tokenService) {
        this.serverService = serverService;
        this.flashMessages = flashMessages;
        this.router = router;
        this.tokenService = tokenService;
        this.email = '';
        this.password = '';
        this.username = '';
    }
    CartComponent.prototype.ngOnInit = function () {
        if (this.tokenService.expiredToken()) {
            this.router.navigate(['public/home']);
        }
        else {
            this.getData();
        }
    };
    CartComponent.prototype.getData = function () {
        var _this = this;
        this.serverService.getCartData().subscribe(function (data) {
            var css = 'alert-success';
            console.log(data);
            if (data.success === true) { //it is authorized, and right type of account.
                _this.email = data.user._id;
                _this.username = data.user.username;
                _this.password = data.user.type;
            }
            else { //not real type of account.
                _this.router.navigate(['public/home']);
                css = 'alert-danger';
            }
            _this.flashMessages.show(data.msg, { cssClass: css, timeout: 3000 });
        });
    };
    CartComponent = __decorate([
        core_1.Component({
            selector: 'app-cart',
            templateUrl: './cart.component.html',
            styleUrls: ['./cart.component.css']
        })
    ], CartComponent);
    return CartComponent;
}());
exports.CartComponent = CartComponent;
