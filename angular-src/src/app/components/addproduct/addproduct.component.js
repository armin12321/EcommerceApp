var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from '@angular/core';
let AddproductComponent = class AddproductComponent {
    constructor(modalService, flashMessage, serverService, router, tokenService) {
        this.modalService = modalService;
        this.flashMessage = flashMessage;
        this.serverService = serverService;
        this.router = router;
        this.tokenService = tokenService;
        this.photos = [];
        this.currentPhoto = 0;
        this.choosenPhotos = '';
    }
    ngOnInit() {
        this.user = this.tokenService.getUser();
        console.log(this.user);
    }
    onSubmit() {
        var fdata = new FormData();
        const product = {
            name: this.name,
            manufactuer: this.manufactuer,
            price: this.price,
            available: this.available,
            condition: this.condition,
            description: this.description
        };
        for (let i = 0; i < this.numberOfPhotos; i++) {
            fdata.append('file', this.photos[i]);
        }
        for (let key in this.user) {
            fdata.append(key, this.user[key]);
        }
        fdata.append('user', JSON.stringify(this.user));
        for (let key in product) {
            fdata.append(key, product[key]);
        }
        this.serverService.postProductData(fdata).subscribe(data => {
            if (data.success) {
                this.flashMessage.show(data.msg, { cssClass: 'alert-success', timeout: 3000 });
                this.router.navigate(['/user/products']);
            }
            else {
                this.flashMessage.show(data.msg, { cssClass: 'alert-danger', timeout: 3000 });
            }
        });
    }
    filesSelected(event, template) {
        if (event.target.files.length > 0) {
            this.numberOfPhotos = event.target.files.length;
            for (let i = 0; i < this.numberOfPhotos; i++) {
                this.photos.push(event.target.files[i]);
            }
        }
        console.log(this.photos);
        this.imgPreview(this.photos[this.currentPhoto]);
        this.openModal(template);
    }
    openModal(template) {
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    }
    nextImage() {
        this.currentPhoto += 1;
        this.currentPhoto %= this.numberOfPhotos;
        this.imgPreview(this.photos[this.currentPhoto]);
    }
    previousImage() {
        this.currentPhoto -= 1;
        if (this.currentPhoto <= -1)
            this.currentPhoto = this.numberOfPhotos - 1;
        this.imgPreview(this.photos[this.currentPhoto]);
    }
    removeImage() {
        this.photos.splice(this.currentPhoto, 1);
        this.currentPhoto -= 1;
        this.numberOfPhotos -= 1;
        if (this.numberOfPhotos == 0) {
            this.currentPhoto = 0;
            this.modalRef.hide();
            return;
        }
        if (this.currentPhoto == -1)
            this.currentPhoto = this.numberOfPhotos - 1;
        this.imgPreview(this.photos[this.currentPhoto]);
    }
    ok() {
        for (let i = 0; i < this.numberOfPhotos; i++) {
            this.choosenPhotos += this.photos[i]['name'];
            this.choosenPhotos += ', ';
        }
        console.log(this.choosenPhotos);
        this.modalRef.hide();
    }
    imgPreview(img) {
        let reader = new FileReader();
        reader.readAsDataURL(img);
        reader.onload = (_event) => {
            this.imgPreviewUrl = reader.result;
        };
    }
};
AddproductComponent = __decorate([
    Component({
        selector: 'app-addproduct',
        templateUrl: './addproduct.component.html',
        styleUrls: ['./addproduct.component.css']
    })
], AddproductComponent);
export { AddproductComponent };
