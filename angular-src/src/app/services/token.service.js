var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
const TOKEN_ID = 'id_token';
const USER_ID = 'user';
let TokenService = class TokenService {
    constructor() { }
    storeUserData(token, user) {
        this.token = token;
        this.user = user;
        localStorage.setItem(TOKEN_ID, this.token);
        localStorage.setItem(USER_ID, JSON.stringify(this.user));
    }
    loadToken() {
        const token = localStorage.getItem(TOKEN_ID);
        this.token = token;
    }
    loadUser() {
        const user = localStorage.getItem(USER_ID);
        this.user = JSON.parse(user);
    }
    getUser() {
        if (this.expiredToken()) {
            return { username: '' };
        }
        else {
            this.loadUser();
            return this.user;
        }
    }
    getToken() {
        this.loadToken();
        return this.token;
    }
    expiredToken() {
        const helper = new JwtHelperService();
        return helper.isTokenExpired(this.getToken());
    }
    deleteToken() {
        localStorage.removeItem(USER_ID);
        localStorage.removeItem(TOKEN_ID);
        localStorage.clear();
    }
};
TokenService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], TokenService);
export { TokenService };
