"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavbarService = void 0;
var core_1 = require("@angular/core");
var types_config_1 = require("../configs/types.config");
var NavbarService = /** @class */ (function () {
    function NavbarService(router, tokenService) {
        this.router = router;
        this.tokenService = tokenService;
    }
    NavbarService.prototype.displayNavbar = function () {
        if (this.router.url === '/user/register' || this.router.url === '/user/login')
            return false;
        return true;
    };
    NavbarService.prototype.loggedIn = function () {
        if (this.tokenService.expiredToken()) {
            return false;
        }
        else {
            return true;
        }
    };
    NavbarService.prototype.logOut = function () {
        this.tokenService.deleteToken();
        this.router.navigate(['public/home']);
    };
    NavbarService.prototype.isBuyer = function () {
        var user = this.tokenService.getUser();
        if (user.type == types_config_1.types.BUYER)
            return true;
        else
            return false;
    };
    NavbarService.prototype.getUsername = function () {
        var us = this.tokenService.getUser().username;
        if (us == null || us == undefined)
            return '';
        else
            return us;
    };
    NavbarService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], NavbarService);
    return NavbarService;
}());
exports.NavbarService = NavbarService;
