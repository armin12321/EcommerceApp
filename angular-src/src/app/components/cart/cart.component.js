var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from '@angular/core';
let CartComponent = class CartComponent {
    constructor(serverService, flashMessages, router, tokenService) {
        this.serverService = serverService;
        this.flashMessages = flashMessages;
        this.router = router;
        this.tokenService = tokenService;
        this.email = '';
        this.password = '';
        this.username = '';
    }
    ngOnInit() {
        if (this.tokenService.expiredToken()) {
            this.router.navigate(['public/home']);
        }
        else {
            this.getData();
        }
    }
    getData() {
        this.serverService.getCartData().subscribe((data) => {
            let css = 'alert-success';
            console.log(data);
            if (data.success === true) { //it is authorized, and right type of account.
                this.email = data.user._id;
                this.username = data.user.username;
                this.password = data.user.type;
            }
            else { //not real type of account.
                this.router.navigate(['public/home']);
                css = 'alert-danger';
            }
            this.flashMessages.show(data.msg, { cssClass: css, timeout: 3000 });
        });
    }
};
CartComponent = __decorate([
    Component({
        selector: 'app-cart',
        templateUrl: './cart.component.html',
        styleUrls: ['./cart.component.css']
    })
], CartComponent);
export { CartComponent };
