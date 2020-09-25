var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from '@angular/core';
let NavbarComponent = class NavbarComponent {
    constructor(navbarService, modalService, flashMessages, serverService) {
        this.navbarService = navbarService;
        this.modalService = modalService;
        this.flashMessages = flashMessages;
        this.serverService = serverService;
        this.title = 'navbar';
        this.username = '';
    }
    ngOnInit() {
        let that = this;
        window.addEventListener('beforeunload', function (e) {
            if (that.navbarService.loggedIn())
                that.changeOnlineStatus(false).subscribe();
        });
        if (this.navbarService.loggedIn()) //if i'm logged in, and navbar is initialized
            this.changeOnlineStatus(true).subscribe();
        this.username = this.navbarService.getUsername();
        this.getMessages();
    }
    getMessages() {
        //throw new Error('Method not implemented.')
        this.myInterval = setInterval(() => {
            if (!this.navbarService.loggedIn())
                return;
            this.serverService.getNotifications().subscribe((data) => {
                if (data.success) {
                    this.numOfMessages = data.numOfMessages;
                }
                else {
                    console.log(data.msg);
                }
            });
        }, 600);
    }
    ngOnDestroy() {
        clearInterval(this.myInterval);
    }
    changeOnlineStatus(b) {
        return this.serverService.changeOnlineStatus({ online: b });
    }
    ngAfterContentChecked() {
        let elem = document.getElementById('mybutton');
        if (elem != null) {
            this.showGreeting();
        }
        this.username = this.navbarService.getUsername();
    }
    openModal(template) {
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    }
    logout() {
        this.changeOnlineStatus(false).subscribe();
        this.username = '';
        this.modalRef.hide();
        this.navbarService.logOut();
        this.flashMessages.show('Logout successful', { cssClass: 'alert-success', timeout: 5000 });
    }
    showGreeting() {
        let element = document.getElementById('mybutton');
        if (this.navbarService.loggedIn() && window.innerWidth > 990) {
            element.style.display = 'inline-block';
        }
        else {
            element.style.display = 'none';
        }
    }
};
NavbarComponent = __decorate([
    Component({
        selector: 'app-navbar',
        templateUrl: './navbar.component.html',
        styleUrls: ['./navbar.component.css']
    })
], NavbarComponent);
export { NavbarComponent };
