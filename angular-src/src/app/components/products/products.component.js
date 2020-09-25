var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from '@angular/core';
let ProductsComponent = class ProductsComponent {
    constructor(serverService, tokenService, flashMessages, router) {
        this.serverService = serverService;
        this.tokenService = tokenService;
        this.flashMessages = flashMessages;
        this.router = router;
    }
    ngOnInit() {
        if (this.tokenService.expiredToken()) {
            this.router.navigate(['/public/home']);
        }
        else {
            this.getData();
        }
    }
    getData() {
        this.serverService.getMyProducts().subscribe((data) => {
            let css = 'alert-success';
            console.log(data);
            if (data.success == true) {
                this.message = data.msg;
            }
            else {
                css = 'alert-danger';
                this.router.navigate['/public/home'];
            }
            this.flashMessages.show(data.msg, { cssClass: css, timeout: 3000 });
        });
    }
};
ProductsComponent = __decorate([
    Component({
        selector: 'app-products',
        templateUrl: './products.component.html',
        styleUrls: ['./products.component.css']
    })
], ProductsComponent);
export { ProductsComponent };
