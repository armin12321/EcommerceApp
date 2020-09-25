var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@angular/core';
let ValidateService = class ValidateService {
    constructor() { }
    validateRegisterForm(data) {
        if (data.name == undefined || data.email == undefined || data.username == undefined ||
            data.password == undefined || data.repeatedPassword == undefined ||
            data.surname == undefined || data.address == undefined || data.type == undefined)
            return false;
        else
            return true;
    }
    validatePasswords(password, repeatedPassword) {
        if (password === repeatedPassword)
            return true;
        else
            return false;
    }
    validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
};
ValidateService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], ValidateService);
export { ValidateService };
