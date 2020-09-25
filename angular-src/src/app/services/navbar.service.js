var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@angular/core';
import { types } from '../configs/types.config';
let NavbarService = class NavbarService {
    constructor(router, tokenService) {
        this.router = router;
        this.tokenService = tokenService;
    }
    displayNavbar() {
        if (this.router.url === '/user/register' || this.router.url === '/user/login')
            return false;
        return true;
    }
    loggedIn() {
        if (this.tokenService.expiredToken()) {
            return false;
        }
        else {
            return true;
        }
    }
    logOut() {
        this.tokenService.deleteToken();
        this.router.navigate(['public/home']);
    }
    isBuyer() {
        const user = this.tokenService.getUser();
        if (user.type == types.BUYER)
            return true;
        else
            return false;
    }
    getUsername() {
        let us = this.tokenService.getUser().username;
        if (us == null || us == undefined)
            return '';
        else
            return us;
    }
};
NavbarService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], NavbarService);
export { NavbarService };
