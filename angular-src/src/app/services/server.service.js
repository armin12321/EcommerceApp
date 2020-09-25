var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@angular/core';
let ServerService = class ServerService {
    constructor(http) {
        this.http = http;
        this.serverURL = '';
    }
    changeOnlineStatus(data) {
        // throw new Error('Method not implemented.');
        return this.http.post(`${this.serverURL}api/info/changeOnlineStatus`, data);
    }
    getRecentChats() {
        // throw new Error('Method not implemented.');
        return this.http.get(`${this.serverURL}api/info/recentChats`);
    }
    findByID(data) {
        // throw new Error('Method not implemented.');
        return this.http.post(`${this.serverURL}api/user/getByID`, data);
    }
    getMessagesInfo() {
        // throw new Error('Method not implemented.');
        return this.http.get(`${this.serverURL}api/info/newMessages`);
    }
    getNotifications() {
        // throw new Error('Method not implemented.');
        return this.http.get(`${this.serverURL}api/user/notifications`);
    }
    getHomeData() {
        return this.http.get(`${this.serverURL}api/public/home`, {}); //here goes http options.
    }
    postRegisterData(data) {
        return this.http.post(`${this.serverURL}api/user/register`, data);
    }
    postProductData(data) {
        return this.http.post(`${this.serverURL}api/product/add`, data);
    }
    postLoginData(data) {
        return this.http.post(`${this.serverURL}api/user/login`, data);
    }
    getProductPicture(data) {
        return this.http.post(`${this.serverURL}api/product/productImage`, data, { responseType: "blob" });
    }
    getProfileData() {
        return this.http.get(`${this.serverURL}api/user/profile`);
    }
    getCartData() {
        return this.http.get(`${this.serverURL}api/user/cart`);
    }
    getMyProducts() {
        return this.http.get(`${this.serverURL}api/user/products`);
    }
    getSellerData(data) {
        return this.http.post(`${this.serverURL}api/public/sellerInfo`, data);
    }
    getProductData(data) {
        return this.http.post(`${this.serverURL}api/public/productInfo`, data);
    }
    getAvatarImage(data) {
        return this.http.post(`${this.serverURL}api/public/avatarImage`, data, { responseType: "blob" });
    }
    getTopProducts(data) {
        return this.http.post(`${this.serverURL}api/public/topProducts`, data);
    }
    loadOldMessages(data) {
        return this.http.post(`${this.serverURL}api/user/chat/loadMessages`, data);
    }
    sendMessagee(data) {
        return this.http.post(`${this.serverURL}api/user/chat/sendMessage`, data);
    }
    getNewMessages(data) {
        return this.http.post(`${this.serverURL}api/user/chat/getNewMessages`, data);
    }
};
ServerService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], ServerService);
export { ServerService };
