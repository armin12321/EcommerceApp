var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from '@angular/core';
let LoginComponent = class LoginComponent {
    constructor(serverService, router, flashMessage, tokenService) {
        this.serverService = serverService;
        this.router = router;
        this.flashMessage = flashMessage;
        this.tokenService = tokenService;
        this.title = 'login page.';
    }
    ngOnInit() {
        if (this.tokenService.expiredToken() === false) {
            this.router.navigate(['/public/home']);
        }
    }
    onSubmit() {
        const credentials = {
            username: this.username,
            password: this.password
        };
        this.serverService.postLoginData(credentials).subscribe((data) => {
            if (data.success == true) {
                this.tokenService.storeUserData(data.token, data.user);
                this.flashMessage.show('You are now logged in', { cssClass: 'alert-success', timeout: 5000 });
                this.changeOnlineStatus(true).subscribe();
                this.router.navigate(['/public/home']); //ako sve bude u redu.
            }
            else {
                this.flashMessage.show(data.msg, { cssClass: 'alert-danger', timeout: 3000 });
                this.router.navigate(['/user/login']);
            }
        });
    }
    changeOnlineStatus(b) {
        return this.serverService.changeOnlineStatus({ online: b });
    }
};
LoginComponent = __decorate([
    Component({
        selector: 'app-login',
        templateUrl: './login.component.html',
        styleUrls: ['./login.component.css']
    })
], LoginComponent);
export { LoginComponent };
