var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@angular/core';
let SharedDataService = class SharedDataService {
    constructor(sanitizer) {
        this.sanitizer = sanitizer;
        this.seller_id = "";
        this.product_id = "";
        this.chat_person_id = "";
        this.chat_person_username = "";
        this.chat_person_avatarURL = "";
    }
    setChatPersonAvatarURL(a) {
        this.chat_person_avatarURL = a;
        localStorage.removeItem("avatarURL");
        localStorage.setItem("avatarURL", this.chat_person_avatarURL);
    }
    getChatPersonAvatarURL() {
        this.chat_person_avatarURL = localStorage.getItem("avatarURL");
        return this.chat_person_avatarURL;
    }
    setProductID(product_id) {
        this.product_id = product_id;
        localStorage.removeItem("productID");
        localStorage.setItem("productID", this.product_id);
    }
    setSellerID(seller_id) {
        this.seller_id = seller_id;
        localStorage.removeItem("sellerID");
        localStorage.setItem("sellerID", this.seller_id);
    }
    getSellerID() {
        this.seller_id = localStorage.getItem("sellerID");
        return this.seller_id;
    }
    getProductID() {
        this.product_id = localStorage.getItem("productID");
        return this.product_id;
    }
    showPicture(image) {
        let reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = (_event) => {
            return this.sanitizer.bypassSecurityTrustUrl(`${reader.result}`);
        };
    }
    setChatPersonID(chat_id) {
        this.chat_person_id = chat_id;
        localStorage.removeItem("chatPersonID");
        localStorage.setItem("chatPersonID", this.chat_person_id);
    }
    getChatPersonID() {
        this.chat_person_id = localStorage.getItem("chatPersonID");
        return this.chat_person_id;
    }
    getChatPersonUsername() {
        this.chat_person_username = localStorage.getItem("chatPersonUsername");
        return this.chat_person_username;
    }
    setChatPersonUsername(i) {
        this.chat_person_username = i;
        localStorage.removeItem("chatPersonUsername");
        localStorage.setItem("chatPersonUsername", this.chat_person_username);
    }
};
SharedDataService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], SharedDataService);
export { SharedDataService };
