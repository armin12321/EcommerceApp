"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavbarComponent = void 0;
var core_1 = require("@angular/core");
var NavbarComponent = /** @class */ (function () {
    function NavbarComponent(navbarService, modalService, flashMessages, serverService) {
        this.navbarService = navbarService;
        this.modalService = modalService;
        this.flashMessages = flashMessages;
        this.serverService = serverService;
        this.title = 'navbar';
        this.username = '';
    }
    NavbarComponent.prototype.ngOnInit = function () {
        var that = this;
        window.addEventListener('beforeunload', function (e) {
            if (that.navbarService.loggedIn())
                that.changeOnlineStatus(false).subscribe();
        });
        if (this.navbarService.loggedIn()) //if i'm logged in, and navbar is initialized
            this.changeOnlineStatus(true).subscribe();
        this.username = this.navbarService.getUsername();
        this.getMessages();
    };
    NavbarComponent.prototype.getMessages = function () {
        var _this = this;
        //throw new Error('Method not implemented.')
        this.myInterval = setInterval(function () {
            if (!_this.navbarService.loggedIn())
                return;
            _this.serverService.getNotifications().subscribe(function (data) {
                if (data.success) {
                    _this.numOfMessages = data.numOfMessages;
                }
                else {
                    console.log(data.msg);
                }
            });
        }, 600);
    };
    NavbarComponent.prototype.ngOnDestroy = function () {
        clearInterval(this.myInterval);
    };
    NavbarComponent.prototype.changeOnlineStatus = function (b) {
        return this.serverService.changeOnlineStatus({ online: b });
    };
    NavbarComponent.prototype.ngAfterContentChecked = function () {
        var elem = document.getElementById('mybutton');
        if (elem != null) {
            this.showGreeting();
        }
        this.username = this.navbarService.getUsername();
    };
    NavbarComponent.prototype.openModal = function (template) {
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    };
    NavbarComponent.prototype.logout = function () {
        this.changeOnlineStatus(false).subscribe();
        this.username = '';
        this.modalRef.hide();
        this.navbarService.logOut();
        this.flashMessages.show('Logout successful', { cssClass: 'alert-success', timeout: 5000 });
    };
    NavbarComponent.prototype.showGreeting = function () {
        var element = document.getElementById('mybutton');
        if (this.navbarService.loggedIn() && window.innerWidth > 990) {
            element.style.display = 'inline-block';
        }
        else {
            element.style.display = 'none';
        }
    };
    NavbarComponent = __decorate([
        core_1.Component({
            selector: 'app-navbar',
            templateUrl: './navbar.component.html',
            styleUrls: ['./navbar.component.css']
        })
    ], NavbarComponent);
    return NavbarComponent;
}());
exports.NavbarComponent = NavbarComponent;
