var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from '@angular/core';
let InfoComponent = class InfoComponent {
    constructor(router, sharedService, serverService, navbarService, sanitizer) {
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
    ngOnInit() {
        this.getMessagesInfo(); //because that is active tab.
    }
    getMessagesInfo() {
        // throw new Error('Method not implemented.');
        this.serverService.getMessagesInfo().subscribe((data) => {
            console.log(data);
            if (data.success) {
                this.messages = data.messages;
                //get image of each and every one of messengers.
                for (let i = 0; i < this.messages.length; i++) {
                    this.imgURLs.push(""); //not to be empty
                    //getID, find by id and return avatar name
                    let id = this.messages[i].from;
                    this.serverService.findByID({ id }).subscribe((data) => {
                        if (data.success) {
                            console.log(data.avatarName);
                            let avatarName = data.avatarName;
                            this.messages[i].avatarName = avatarName;
                            this.serverService.getAvatarImage({ avatarName }).subscribe((picture) => {
                                this.showPicture(picture, i);
                            });
                        }
                        else {
                            console.log(data.msg);
                        }
                    });
                }
            }
            else {
                console.log(data.msg);
            }
        });
    }
    getOrderInfo() {
        //we'll implement it later.
    }
    getRecentChats() {
        this.serverService.getRecentChats().subscribe((data) => {
            if (data.success) {
                console.log(data);
                this.people = data.people;
                //get image of every guy
                for (let i = 0; i < this.people.length; i++) {
                    this.imgChats.push("");
                    let id = this.people[i].messengerID;
                    this.serverService.findByID({ id }).subscribe((data) => {
                        if (data.success) {
                            let avatarName = data.avatarName;
                            this.people[i].avatarName = avatarName;
                            this.serverService.getAvatarImage({ avatarName }).subscribe((picture) => {
                                this.showPicture1(picture, i);
                            });
                        }
                        else {
                            console.log(data.msg);
                        }
                    });
                }
            }
            else {
                console.log(data.msg);
            }
        });
    }
    showPicture(image, index) {
        let reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = (_event) => {
            this.imgURLs[index] = this.sanitizer.bypassSecurityTrustUrl(`${reader.result}`);
        };
    }
    showPicture1(image, index) {
        let reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = (_event) => {
            this.imgChats[index] = this.sanitizer.bypassSecurityTrustUrl(`${reader.result}`);
        };
    }
    goToChat(message) {
        //set our ID and usename of our chat person:
        console.log(message);
        this.sharedService.setChatPersonID(message.from);
        this.sharedService.setChatPersonUsername(message.fromUsername);
        this.sharedService.setChatPersonAvatarURL(message.avatarName);
        this.router.navigate(['/user/chat']);
    }
    goToChat1(people) {
        console.log(people);
        this.sharedService.setChatPersonAvatarURL(people.avatarName);
        this.sharedService.setChatPersonID(people.messengerID);
        this.sharedService.setChatPersonUsername(people.messengerUsername);
        this.router.navigate(['user/chat']);
    }
};
InfoComponent = __decorate([
    Component({
        selector: 'app-info',
        templateUrl: './info.component.html',
        styleUrls: ['./info.component.css']
    })
], InfoComponent);
export { InfoComponent };
