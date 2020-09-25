var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from '@angular/core';
let ChatComponent = class ChatComponent {
    constructor(serverService, sharedData, router, sanitizer) {
        this.serverService = serverService;
        this.sharedData = sharedData;
        this.router = router;
        this.sanitizer = sanitizer;
        this.chat_person_id = "";
        this.user_id = "";
        this.chat_person_username = "";
        this.message = "";
        this.Messages = [];
        this.pictureURL = "";
        this.numOfMessages = 0;
        this.online = false;
        this.lastTimeOnline = [];
    }
    ngAfterContentChecked() {
    }
    ngOnDestroy() {
        clearInterval(this.myInterval);
    }
    ngOnInit() {
        this.chat_person_id = this.sharedData.getChatPersonID();
        this.chat_person_username = this.sharedData.getChatPersonUsername();
        //get person's avatar image, and then set it.
        console.log(this.sharedData.getChatPersonAvatarURL());
        this.serverService.getAvatarImage({ avatarName: this.sharedData.getChatPersonAvatarURL() }).subscribe((picture) => {
            this.showPicture(picture);
        });
        //load all the messages that you have been typing with this guy.
        this.loadMessages({ chat_id: this.chat_person_id }).subscribe((data) => {
            //this load operation aproximatelly needs 200ms, so we can try multiple values.
            if (data.msg === "not authorized") {
                this.router.navigate(['/public/home']);
            }
            else {
                if (data.msg === "loaded messages successfully") {
                    console.log(data);
                    this.Messages = data.messages;
                    this.scroll();
                }
                else {
                    console.log(data.msg);
                }
            }
        });
        //Get messages that keep coming.
        this.getMessages();
    }
    showModal() {
        if (this.numOfMessages != 0)
            return true;
        else
            return false;
    }
    goDown() {
        this.scroll();
        this.numOfMessages = 0;
    }
    getMessages() {
        // throw new Error('Method not implemented.');
        this.myInterval = setInterval(() => {
            this.serverService.getNewMessages({ chat_id: this.chat_person_id }).subscribe((data) => {
                //add all messages to the old ones, and try to scroll down.
                if (data.success) {
                    for (let i = 0; i < data.messages.length; i++) {
                        this.Messages.push(data.messages[i]);
                    }
                    let box = document.getElementById('box');
                    if (data.messages.length != 0 && (box.scrollHeight - box.scrollTop <= 515)) {
                        this.scroll();
                    }
                    else if (data.messages.length != 0 && (box.scrollHeight - box.scrollTop > 515)) {
                        this.numOfMessages = data.messages.length;
                    }
                    //let's get if chat_person is online:
                    this.online = data.isOnline;
                    //also get it's last time online attribute
                    this.lastTimeOnline = data.lastTimeOnline;
                    //update seen id:
                    this.seen_id = data.seen_id;
                }
                else {
                    console.log(data.msg);
                }
            });
        }, 500);
    }
    lastSeen(message_id) {
        if (String(message_id) == String(this.seen_id))
            return true;
        else
            return false;
    }
    loadMessages(data) {
        return this.serverService.loadOldMessages(data);
    }
    scrollDown() {
        let box = document.getElementById('box');
        box.scrollTop = box.scrollHeight;
    }
    sendMessage() {
        console.log(this.message);
        let wrapper = {
            to: this.chat_person_id,
            message: this.message,
            toUsername: this.chat_person_username
        };
        this.send(wrapper).subscribe((data) => {
            this.message = ""; //not to see same message again.      
            //add real time to this message      
            this.Messages.push(data.message);
            this.scroll();
        });
    }
    scroll() {
        setTimeout(() => {
            this.scrollDown();
        }, 0);
    }
    send(data) {
        return this.serverService.sendMessagee(data);
    }
    calcClass(message) {
        let classes = ['ml-auto', 'mb-3'];
        if (message.to == this.chat_person_id)
            return classes;
    }
    calcClass1(message) {
        let classes = ['ml-3'];
        if (message.to != this.chat_person_id)
            return classes;
    }
    calcClass2(message) {
        let dark = ['bg-dark'];
        let primary = ['bg-primary'];
        if (message.to == this.chat_person_id)
            return primary;
        else
            return dark;
    }
    showPicture(image) {
        let reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = (_event) => {
            this.pictureURL = this.sanitizer.bypassSecurityTrustUrl(`${reader.result}`);
        };
    }
    calcPictureStyle(message) {
        const dont_need_picture = {
            'display': 'none'
        };
        if (message.to == this.chat_person_id) {
            return dont_need_picture;
        }
        else { //else style picture 
            return {};
        }
    }
};
ChatComponent = __decorate([
    Component({
        selector: 'app-chat',
        templateUrl: './chat.component.html',
        styleUrls: ['./chat.component.css']
    })
], ChatComponent);
export { ChatComponent };
