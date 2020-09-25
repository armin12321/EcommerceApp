"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerService = void 0;
var core_1 = require("@angular/core");
var ServerService = /** @class */ (function () {
    function ServerService(http) {
        this.http = http;
        this.serverURL = '';
    }
    ServerService.prototype.changeOnlineStatus = function (data) {
        // throw new Error('Method not implemented.');
        return this.http.post(this.serverURL + "api/info/changeOnlineStatus", data);
    };
    ServerService.prototype.getRecentChats = function () {
        // throw new Error('Method not implemented.');
        return this.http.get(this.serverURL + "api/info/recentChats");
    };
    ServerService.prototype.findByID = function (data) {
        // throw new Error('Method not implemented.');
        return this.http.post(this.serverURL + "api/user/getByID", data);
    };
    ServerService.prototype.getMessagesInfo = function () {
        // throw new Error('Method not implemented.');
        return this.http.get(this.serverURL + "api/info/newMessages");
    };
    ServerService.prototype.getNotifications = function () {
        // throw new Error('Method not implemented.');
        return this.http.get(this.serverURL + "api/user/notifications");
    };
    ServerService.prototype.getHomeData = function () {
        return this.http.get(this.serverURL + "api/public/home", {}); //here goes http options.
    };
    ServerService.prototype.postRegisterData = function (data) {
        return this.http.post(this.serverURL + "api/user/register", data);
    };
    ServerService.prototype.postProductData = function (data) {
        return this.http.post(this.serverURL + "api/product/add", data);
    };
    ServerService.prototype.postLoginData = function (data) {
        return this.http.post(this.serverURL + "api/user/login", data);
    };
    ServerService.prototype.getProductPicture = function (data) {
        return this.http.post(this.serverURL + "api/product/productImage", data, { responseType: "blob" });
    };
    ServerService.prototype.getProfileData = function () {
        return this.http.get(this.serverURL + "api/user/profile");
    };
    ServerService.prototype.getCartData = function () {
        return this.http.get(this.serverURL + "api/user/cart");
    };
    ServerService.prototype.getMyProducts = function () {
        return this.http.get(this.serverURL + "api/user/products");
    };
    ServerService.prototype.getSellerData = function (data) {
        return this.http.post(this.serverURL + "api/public/sellerInfo", data);
    };
    ServerService.prototype.getProductData = function (data) {
        return this.http.post(this.serverURL + "api/public/productInfo", data);
    };
    ServerService.prototype.getAvatarImage = function (data) {
        return this.http.post(this.serverURL + "api/public/avatarImage", data, { responseType: "blob" });
    };
    ServerService.prototype.getTopProducts = function (data) {
        return this.http.post(this.serverURL + "api/public/topProducts", data);
    };
    ServerService.prototype.loadOldMessages = function (data) {
        return this.http.post(this.serverURL + "api/user/chat/loadMessages", data);
    };
    ServerService.prototype.sendMessagee = function (data) {
        return this.http.post(this.serverURL + "api/user/chat/sendMessage", data);
    };
    ServerService.prototype.getNewMessages = function (data) {
        return this.http.post(this.serverURL + "api/user/chat/getNewMessages", data);
    };
    ServerService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], ServerService);
    return ServerService;
}());
exports.ServerService = ServerService;
