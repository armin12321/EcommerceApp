var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from '@angular/core';
let HomeComponent = class HomeComponent {
    constructor(serverService, sanitizer, sharedData, router) {
        this.serverService = serverService;
        this.sanitizer = sanitizer;
        this.sharedData = sharedData;
        this.router = router;
        this.title = 'homepage';
        this.imageURLs = [];
    }
    ngOnInit() {
        this.getData();
    }
    ngAfterContentChecked() {
        let column = document.getElementById('column');
        if (column != null) { //ucitan je.
            this.resize();
        }
    }
    setSellerID(productIndex) {
        this.sharedData.setSellerID(this.products[productIndex].product.user._id);
        this.router.navigate(['/public/sellerInfo']);
    }
    setProductID(productIndex) {
        this.sharedData.setProductID(this.products[productIndex].product._id);
        this.router.navigate(['/public/productInfo']);
    }
    getData() {
        this.serverService.getHomeData().subscribe((data) => {
            console.log(data);
            this.products = data.products;
            for (let i = 0; i < data.products.length; i++) {
                //get url of first image in the array as avatar.
                let url = data.products[i].product.images[0];
                this.imageURLs.push(''); // not to be undefined
                this.getProductPicture(url).subscribe((picture) => {
                    console.log(picture);
                    this.imgPreview(picture, i);
                });
            }
        });
    }
    getProductPicture(url) {
        const wrapper = {
            url
        };
        return this.serverService.getProductPicture(wrapper);
    }
    resize() {
        let column = document.getElementById('column');
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
    }
    imgPreview(img, index) {
        let reader = new FileReader();
        reader.readAsDataURL(img);
        reader.onload = (_event) => {
            this.imageURLs[index] = this.sanitizer.bypassSecurityTrustUrl(`${reader.result}`);
        };
    }
    imageStyle() {
        return {
            'border-radius': '50px'
        };
    }
};
HomeComponent = __decorate([
    Component({
        selector: 'app-home',
        templateUrl: './home.component.html',
        styleUrls: ['./home.component.css']
    })
], HomeComponent);
export { HomeComponent };
