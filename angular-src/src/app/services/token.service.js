"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
var core_1 = require("@angular/core");
var angular_jwt_1 = require("@auth0/angular-jwt");
var TOKEN_ID = 'id_token';
var USER_ID = 'user';
var TokenService = /** @class */ (function () {
    function TokenService() {
    }
    TokenService.prototype.storeUserData = function (token, user) {
        this.token = token;
        this.user = user;
        localStorage.setItem(TOKEN_ID, this.token);
        localStorage.setItem(USER_ID, JSON.stringify(this.user));
    };
    TokenService.prototype.loadToken = function () {
        var token = localStorage.getItem(TOKEN_ID);
        this.token = token;
    };
    TokenService.prototype.loadUser = function () {
        var user = localStorage.getItem(USER_ID);
        this.user = JSON.parse(user);
    };
    TokenService.prototype.getUser = function () {
        if (this.expiredToken()) {
            return { username: '' };
        }
        else {
            this.loadUser();
            return this.user;
        }
    };
    TokenService.prototype.getToken = function () {
        this.loadToken();
        return this.token;
    };
    TokenService.prototype.expiredToken = function () {
        var helper = new angular_jwt_1.JwtHelperService();
        return helper.isTokenExpired(this.getToken());
    };
    TokenService.prototype.deleteToken = function () {
        localStorage.removeItem(USER_ID);
        localStorage.removeItem(TOKEN_ID);
        localStorage.clear();
    };
    TokenService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], TokenService);
    return TokenService;
}());
exports.TokenService = TokenService;
