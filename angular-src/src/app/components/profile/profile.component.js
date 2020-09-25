"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileComponent = void 0;
var core_1 = require("@angular/core");
var ProfileComponent = /** @class */ (function () {
    function ProfileComponent(serverService, flashMessages, router, tokenService) {
        this.serverService = serverService;
        this.flashMessages = flashMessages;
        this.router = router;
        this.tokenService = tokenService;
        this.email = '';
        this.password = '';
        this.username = '';
    }
    ProfileComponent.prototype.ngOnInit = function () {
        if (this.tokenService.expiredToken()) {
            this.router.navigate(['/public/home']);
        }
        else {
            this.getData();
        }
    };
    ProfileComponent.prototype.getData = function () {
        var _this = this;
        this.serverService.getProfileData().subscribe(function (data) {
            var css = 'alert-success';
            console.log(data);
            if (data.success === true) {
                _this.email = data.user._id;
                _this.username = data.user.username;
                _this.password = data.user.type;
            }
            else {
                css = 'alert-danger';
                _this.router.navigate(['public/home']);
            }
            _this.flashMessages.show(data.msg, { cssClass: css, timeout: 3000 });
        });
    };
    ProfileComponent = __decorate([
        core_1.Component({
            selector: 'app-profile',
            templateUrl: './profile.component.html',
            styleUrls: ['./profile.component.css']
        })
    ], ProfileComponent);
    return ProfileComponent;
}());
exports.ProfileComponent = ProfileComponent;
