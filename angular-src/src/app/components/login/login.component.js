"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginComponent = void 0;
var core_1 = require("@angular/core");
var LoginComponent = /** @class */ (function () {
    function LoginComponent(serverService, router, flashMessage, tokenService) {
        this.serverService = serverService;
        this.router = router;
        this.flashMessage = flashMessage;
        this.tokenService = tokenService;
        this.title = 'login page.';
    }
    LoginComponent.prototype.ngOnInit = function () {
        if (this.tokenService.expiredToken() === false) {
            this.router.navigate(['/public/home']);
        }
    };
    LoginComponent.prototype.onSubmit = function () {
        var _this = this;
        var credentials = {
            username: this.username,
            password: this.password
        };
        this.serverService.postLoginData(credentials).subscribe(function (data) {
            if (data.success == true) {
                _this.tokenService.storeUserData(data.token, data.user);
                _this.flashMessage.show('You are now logged in', { cssClass: 'alert-success', timeout: 5000 });
                _this.changeOnlineStatus(true).subscribe();
                _this.router.navigate(['/public/home']); //ako sve bude u redu.
            }
            else {
                _this.flashMessage.show(data.msg, { cssClass: 'alert-danger', timeout: 3000 });
                _this.router.navigate(['/user/login']);
            }
        });
    };
    LoginComponent.prototype.changeOnlineStatus = function (b) {
        return this.serverService.changeOnlineStatus({ online: b });
    };
    LoginComponent = __decorate([
        core_1.Component({
            selector: 'app-login',
            templateUrl: './login.component.html',
            styleUrls: ['./login.component.css']
        })
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
