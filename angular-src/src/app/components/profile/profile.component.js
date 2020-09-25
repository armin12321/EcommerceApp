var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from '@angular/core';
let ProfileComponent = class ProfileComponent {
    constructor(serverService, flashMessages, router, tokenService) {
        this.serverService = serverService;
        this.flashMessages = flashMessages;
        this.router = router;
        this.tokenService = tokenService;
        this.email = '';
        this.password = '';
        this.username = '';
    }
    ngOnInit() {
        if (this.tokenService.expiredToken()) {
            this.router.navigate(['/public/home']);
        }
        else {
            this.getData();
        }
    }
    getData() {
        this.serverService.getProfileData().subscribe((data) => {
            let css = 'alert-success';
            console.log(data);
            if (data.success === true) {
                this.email = data.user._id;
                this.username = data.user.username;
                this.password = data.user.type;
            }
            else {
                css = 'alert-danger';
                this.router.navigate(['public/home']);
            }
            this.flashMessages.show(data.msg, { cssClass: css, timeout: 3000 });
        });
    }
};
ProfileComponent = __decorate([
    Component({
        selector: 'app-profile',
        templateUrl: './profile.component.html',
        styleUrls: ['./profile.component.css']
    })
], ProfileComponent);
export { ProfileComponent };
