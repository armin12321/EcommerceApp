"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfoComponent = void 0;
var core_1 = require("@angular/core");
var InfoComponent = /** @class */ (function () {
    function InfoComponent(router, sharedService, serverService, navbarService, sanitizer) {
        this.router = router;
        this.sharedService = sharedService;
        this.serverService = serverService;
        this.navbarService = navbarService;
        this.sanitizer = sanitizer;
        this.messages = [];
        this.imgURLs = [];
        this.people = [];
        this.imgChats = [];
    }
    InfoComponent.prototype.ngOnInit = function () {
        this.getMessagesInfo(); //because that is active tab.
    };
    InfoComponent.prototype.getMessagesInfo = function () {
        var _this = this;
        // throw new Error('Method not implemented.');
        this.serverService.getMessagesInfo().subscribe(function (data) {
            console.log(data);
            if (data.success) {
                _this.messages = data.messages;
                var _loop_1 = function (i) {
                    _this.imgURLs.push(""); //not to be empty
                    //getID, find by id and return avatar name
                    var id = _this.messages[i].from;
                    _this.serverService.findByID({ id: id }).subscribe(function (data) {
                        if (data.success) {
                            console.log(data.avatarName);
                            var avatarName = data.avatarName;
                            _this.messages[i].avatarName = avatarName;
                            _this.serverService.getAvatarImage({ avatarName: avatarName }).subscribe(function (picture) {
                                _this.showPicture(picture, i);
                            });
                        }
                        else {
                            console.log(data.msg);
                        }
                    });
                };
                //get image of each and every one of messengers.
                for (var i = 0; i < _this.messages.length; i++) {
                    _loop_1(i);
                }
            }
            else {
                console.log(data.msg);
            }
        });
    };
    InfoComponent.prototype.getOrderInfo = function () {
        //we'll implement it later.
    };
    InfoComponent.prototype.getRecentChats = function () {
        var _this = this;
        this.serverService.getRecentChats().subscribe(function (data) {
            if (data.success) {
                console.log(data);
                _this.people = data.people;
                var _loop_2 = function (i) {
                    _this.imgChats.push("");
                    var id = _this.people[i].messengerID;
                    _this.serverService.findByID({ id: id }).subscribe(function (data) {
                        if (data.success) {
                            var avatarName = data.avatarName;
                            _this.people[i].avatarName = avatarName;
                            _this.serverService.getAvatarImage({ avatarName: avatarName }).subscribe(function (picture) {
                                _this.showPicture1(picture, i);
                            });
                        }
                        else {
                            console.log(data.msg);
                        }
                    });
                };
                //get image of every guy
                for (var i = 0; i < _this.people.length; i++) {
                    _loop_2(i);
                }
            }
            else {
                console.log(data.msg);
            }
        });
    };
    InfoComponent.prototype.showPicture = function (image, index) {
        var _this = this;
        var reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = function (_event) {
            _this.imgURLs[index] = _this.sanitizer.bypassSecurityTrustUrl("" + reader.result);
        };
    };
    InfoComponent.prototype.showPicture1 = function (image, index) {
        var _this = this;
        var reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = function (_event) {
            _this.imgChats[index] = _this.sanitizer.bypassSecurityTrustUrl("" + reader.result);
        };
    };
    InfoComponent.prototype.goToChat = function (message) {
        //set our ID and usename of our chat person:
        console.log(message);
        this.sharedService.setChatPersonID(message.from);
        this.sharedService.setChatPersonUsername(message.fromUsername);
        this.sharedService.setChatPersonAvatarURL(message.avatarName);
        this.router.navigate(['/user/chat']);
    };
    InfoComponent.prototype.goToChat1 = function (people) {
        console.log(people);
        this.sharedService.setChatPersonAvatarURL(people.avatarName);
        this.sharedService.setChatPersonID(people.messengerID);
        this.sharedService.setChatPersonUsername(people.messengerUsername);
        this.router.navigate(['user/chat']);
    };
    InfoComponent = __decorate([
        core_1.Component({
            selector: 'app-info',
            templateUrl: './info.component.html',
            styleUrls: ['./info.component.css']
        })
    ], InfoComponent);
    return InfoComponent;
}());
exports.InfoComponent = InfoComponent;
