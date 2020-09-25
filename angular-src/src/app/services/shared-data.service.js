"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedDataService = void 0;
var core_1 = require("@angular/core");
var SharedDataService = /** @class */ (function () {
    function SharedDataService(sanitizer) {
        this.sanitizer = sanitizer;
        this.seller_id = "";
        this.product_id = "";
        this.chat_person_id = "";
        this.chat_person_username = "";
        this.chat_person_avatarURL = "";
    }
    SharedDataService.prototype.setChatPersonAvatarURL = function (a) {
        this.chat_person_avatarURL = a;
        localStorage.removeItem("avatarURL");
        localStorage.setItem("avatarURL", this.chat_person_avatarURL);
    };
    SharedDataService.prototype.getChatPersonAvatarURL = function () {
        this.chat_person_avatarURL = localStorage.getItem("avatarURL");
        return this.chat_person_avatarURL;
    };
    SharedDataService.prototype.setProductID = function (product_id) {
        this.product_id = product_id;
        localStorage.removeItem("productID");
        localStorage.setItem("productID", this.product_id);
    };
    SharedDataService.prototype.setSellerID = function (seller_id) {
        this.seller_id = seller_id;
        localStorage.removeItem("sellerID");
        localStorage.setItem("sellerID", this.seller_id);
    };
    SharedDataService.prototype.getSellerID = function () {
        this.seller_id = localStorage.getItem("sellerID");
        return this.seller_id;
    };
    SharedDataService.prototype.getProductID = function () {
        this.product_id = localStorage.getItem("productID");
        return this.product_id;
    };
    SharedDataService.prototype.showPicture = function (image) {
        var _this = this;
        var reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = function (_event) {
            return _this.sanitizer.bypassSecurityTrustUrl("" + reader.result);
        };
    };
    SharedDataService.prototype.setChatPersonID = function (chat_id) {
        this.chat_person_id = chat_id;
        localStorage.removeItem("chatPersonID");
        localStorage.setItem("chatPersonID", this.chat_person_id);
    };
    SharedDataService.prototype.getChatPersonID = function () {
        this.chat_person_id = localStorage.getItem("chatPersonID");
        return this.chat_person_id;
    };
    SharedDataService.prototype.getChatPersonUsername = function () {
        this.chat_person_username = localStorage.getItem("chatPersonUsername");
        return this.chat_person_username;
    };
    SharedDataService.prototype.setChatPersonUsername = function (i) {
        this.chat_person_username = i;
        localStorage.removeItem("chatPersonUsername");
        localStorage.setItem("chatPersonUsername", this.chat_person_username);
    };
    SharedDataService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], SharedDataService);
    return SharedDataService;
}());
exports.SharedDataService = SharedDataService;
