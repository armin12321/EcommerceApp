var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from '@angular/core';
let SellerInfoComponent = class SellerInfoComponent {
    constructor(sanitizer, serverService, sharedData, router, navbarService, tokenService) {
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
    ngOnInit() {
        this.getData();
    }
    ngAfterContentChecked() {
        //Here change some of the classes to display nicely
        let avatarImage = document.getElementById('avatarImage');
        let userInfo = document.getElementById('info');
        if (avatarImage != null && userInfo != null) { //loaded
            this.resize();
        }
    }
    Chat() {
        this.sharedData.setChatPersonUsername(this.user.username);
        this.sharedData.setChatPersonID(this.user._id);
        this.router.navigate(['/user/chat']);
    }
    sameUser() {
        if (this.user._id == this.tokenService.getUser()._id)
            return true;
        return false;
    }
    getData() {
        //firstly, get data about the seller
        let wrapper = {
            _id: this.sharedData.getSellerID()
        };
        this.serverService.getSellerData(wrapper).subscribe((data) => {
            console.log(data);
            if (data.success) {
                this.user = data.user; // this is gonna display in html.
                this.sharedData.setChatPersonAvatarURL(this.user.avatarName);
                this.getAvatarImage(this.user.avatarName).subscribe((picture) => {
                    this.imgPreview(picture);
                });
                //We will return top 10 most purchased products of this seller.
                this.serverService.getTopProducts(wrapper).subscribe((data) => {
                    console.log(data);
                    this.products = data.products;
                    for (let i = 0; i < data.products.length; i++) {
                        //get url of first image in the array as avatar.
                        let url = data.products[i].product.images[0];
                        this.imageURLs.push(''); // not to be undefined
                        this.getProductPicture(url).subscribe((picture) => {
                            console.log(picture);
                            this.imgPreview1(picture, i);
                        });
                    }
                });
            }
            else {
                console.log(data.msg);
            }
        });
    }
    getProductPicture(url) {
        return this.serverService.getProductPicture({ url });
    }
    getAvatarImage(avatarName) {
        return this.serverService.getAvatarImage({ avatarName });
    }
    setProductID(productIndex) {
        this.sharedData.setProductID(this.products[productIndex].product._id);
        this.router.navigate(['/public/productInfo']);
    }
    resize() {
        //resize event handler - for displaying nicely.
        let column = document.getElementById('avatarImage');
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
    }
    imgPreview(img) {
        let reader = new FileReader();
        reader.readAsDataURL(img);
        reader.onload = (_event) => {
            this.avatarURL = this.sanitizer.bypassSecurityTrustUrl(`${reader.result}`);
        };
    }
    pictureStyle() {
        return {
            'border-radius': '120px 20px 120px 20px'
        };
    }
    imgPreview1(img, index) {
        let reader = new FileReader();
        reader.readAsDataURL(img);
        reader.onload = (_event) => {
            this.imageURLs[index] = this.sanitizer.bypassSecurityTrustUrl(`${reader.result}`);
        };
    }
};
SellerInfoComponent = __decorate([
    Component({
        selector: 'app-seller-info',
        templateUrl: './seller-info.component.html',
        styleUrls: ['./seller-info.component.css']
    })
], SellerInfoComponent);
export { SellerInfoComponent };
