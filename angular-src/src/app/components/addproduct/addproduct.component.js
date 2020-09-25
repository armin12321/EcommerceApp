"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddproductComponent = void 0;
var core_1 = require("@angular/core");
var AddproductComponent = /** @class */ (function () {
    function AddproductComponent(modalService, flashMessage, serverService, router, tokenService) {
        this.modalService = modalService;
        this.flashMessage = flashMessage;
        this.serverService = serverService;
        this.router = router;
        this.tokenService = tokenService;
        this.photos = [];
        this.currentPhoto = 0;
        this.choosenPhotos = '';
    }
    AddproductComponent.prototype.ngOnInit = function () {
        this.user = this.tokenService.getUser();
        console.log(this.user);
    };
    AddproductComponent.prototype.onSubmit = function () {
        var _this = this;
        var fdata = new FormData();
        var product = {
            name: this.name,
            manufactuer: this.manufactuer,
            price: this.price,
            available: this.available,
            condition: this.condition,
            description: this.description
        };
        for (var i = 0; i < this.numberOfPhotos; i++) {
            fdata.append('file', this.photos[i]);
        }
        for (var key in this.user) {
            fdata.append(key, this.user[key]);
        }
        fdata.append('user', JSON.stringify(this.user));
        for (var key in product) {
            fdata.append(key, product[key]);
        }
        this.serverService.postProductData(fdata).subscribe(function (data) {
            if (data.success) {
                _this.flashMessage.show(data.msg, { cssClass: 'alert-success', timeout: 3000 });
                _this.router.navigate(['/user/products']);
            }
            else {
                _this.flashMessage.show(data.msg, { cssClass: 'alert-danger', timeout: 3000 });
            }
        });
    };
    AddproductComponent.prototype.filesSelected = function (event, template) {
        if (event.target.files.length > 0) {
            this.numberOfPhotos = event.target.files.length;
            for (var i = 0; i < this.numberOfPhotos; i++) {
                this.photos.push(event.target.files[i]);
            }
        }
        console.log(this.photos);
        this.imgPreview(this.photos[this.currentPhoto]);
        this.openModal(template);
    };
    AddproductComponent.prototype.openModal = function (template) {
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    };
    AddproductComponent.prototype.nextImage = function () {
        this.currentPhoto += 1;
        this.currentPhoto %= this.numberOfPhotos;
        this.imgPreview(this.photos[this.currentPhoto]);
    };
    AddproductComponent.prototype.previousImage = function () {
        this.currentPhoto -= 1;
        if (this.currentPhoto <= -1)
            this.currentPhoto = this.numberOfPhotos - 1;
        this.imgPreview(this.photos[this.currentPhoto]);
    };
    AddproductComponent.prototype.removeImage = function () {
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
    };
    AddproductComponent.prototype.ok = function () {
        for (var i = 0; i < this.numberOfPhotos; i++) {
            this.choosenPhotos += this.photos[i]['name'];
            this.choosenPhotos += ', ';
        }
        console.log(this.choosenPhotos);
        this.modalRef.hide();
    };
    AddproductComponent.prototype.imgPreview = function (img) {
        var _this = this;
        var reader = new FileReader();
        reader.readAsDataURL(img);
        reader.onload = function (_event) {
            _this.imgPreviewUrl = reader.result;
        };
    };
    AddproductComponent = __decorate([
        core_1.Component({
            selector: 'app-addproduct',
            templateUrl: './addproduct.component.html',
            styleUrls: ['./addproduct.component.css']
        })
    ], AddproductComponent);
    return AddproductComponent;
}());
exports.AddproductComponent = AddproductComponent;
