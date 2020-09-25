var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from '@angular/core';
let RegisterComponent = class RegisterComponent {
    constructor(serverService, validateService, flashMessage, router, tokenService) {
        this.serverService = serverService;
        this.validateService = validateService;
        this.flashMessage = flashMessage;
        this.router = router;
        this.tokenService = tokenService;
        this.title = 'register page.';
    }
    ngOnInit() {
        if (this.tokenService.expiredToken() === false) {
            this.router.navigate(['/public/home']);
        }
    }
    onSubmit() {
        var fdata = new FormData();
        const user = {
            name: this.name,
            surname: this.surname,
            email: this.email,
            username: this.username,
            password: this.password,
            address: this.address,
            type: this.type,
            repeatedPassword: this.repeatedPassword
        };
        if (!this.validateService.validateRegisterForm(user)) {
            this.flashMessage.show('Please fill in all fields!', { cssClass: 'alert-danger', timeout: 3000 });
            return false;
        }
        if (!this.validateService.validateEmail(user.email)) {
            this.flashMessage.show('Please provide valid email!', { cssClass: 'alert-danger', timeout: 3000 });
            return false;
        }
        if (!this.validateService.validatePasswords(user.password, user.repeatedPassword)) {
            this.flashMessage.show("Passwords don't match!", { cssClass: 'alert-danger', timeout: 3000 });
            return false;
        }
        for (let key in user) {
            fdata.append(key, user[key]);
        }
        fdata.append('file', this.img);
        this.serverService.postRegisterData(fdata).subscribe(data => {
            if (data.success) {
                this.flashMessage.show(data.msg, { cssClass: 'alert-success', timeout: 3000 });
                this.router.navigate(['user/login']);
            }
            else {
                this.flashMessage.show(data.msg, { cssClass: 'alert-danger', timeout: 3000 });
            }
        });
    }
    fileSelected(event) {
        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            this.img = file;
        }
        let reader = new FileReader();
        reader.readAsDataURL(this.img);
        reader.onload = (_event) => {
            this.imgUrl = reader.result;
        };
    }
};
RegisterComponent = __decorate([
    Component({
        selector: 'app-register',
        templateUrl: './register.component.html',
        styleUrls: ['./register.component.css']
    })
], RegisterComponent);
export { RegisterComponent };
