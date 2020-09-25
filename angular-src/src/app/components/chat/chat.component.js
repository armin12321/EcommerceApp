"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatComponent = void 0;
var core_1 = require("@angular/core");
var ChatComponent = /** @class */ (function () {
    function ChatComponent(serverService, sharedData, router, sanitizer) {
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
    ChatComponent.prototype.ngAfterContentChecked = function () {
    };
    ChatComponent.prototype.ngOnDestroy = function () {
        clearInterval(this.myInterval);
    };
    ChatComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.chat_person_id = this.sharedData.getChatPersonID();
        this.chat_person_username = this.sharedData.getChatPersonUsername();
        //get person's avatar image, and then set it.
        console.log(this.sharedData.getChatPersonAvatarURL());
        this.serverService.getAvatarImage({ avatarName: this.sharedData.getChatPersonAvatarURL() }).subscribe(function (picture) {
            _this.showPicture(picture);
        });
        //load all the messages that you have been typing with this guy.
        this.loadMessages({ chat_id: this.chat_person_id }).subscribe(function (data) {
            //this load operation aproximatelly needs 200ms, so we can try multiple values.
            if (data.msg === "not authorized") {
                _this.router.navigate(['/public/home']);
            }
            else {
                if (data.msg === "loaded messages successfully") {
                    console.log(data);
                    _this.Messages = data.messages;
                    _this.scroll();
                }
                else {
                    console.log(data.msg);
                }
            }
        });
        //Get messages that keep coming.
        this.getMessages();
    };
    ChatComponent.prototype.showModal = function () {
        if (this.numOfMessages != 0)
            return true;
        else
            return false;
    };
    ChatComponent.prototype.goDown = function () {
        this.scroll();
        this.numOfMessages = 0;
    };
    ChatComponent.prototype.getMessages = function () {
        var _this = this;
        // throw new Error('Method not implemented.');
        this.myInterval = setInterval(function () {
            _this.serverService.getNewMessages({ chat_id: _this.chat_person_id }).subscribe(function (data) {
                //add all messages to the old ones, and try to scroll down.
                if (data.success) {
                    for (var i = 0; i < data.messages.length; i++) {
                        _this.Messages.push(data.messages[i]);
                    }
                    var box = document.getElementById('box');
                    if (data.messages.length != 0 && (box.scrollHeight - box.scrollTop <= 515)) {
                        _this.scroll();
                    }
                    else if (data.messages.length != 0 && (box.scrollHeight - box.scrollTop > 515)) {
                        _this.numOfMessages = data.messages.length;
                    }
                    //let's get if chat_person is online:
                    _this.online = data.isOnline;
                    //also get it's last time online attribute
                    _this.lastTimeOnline = data.lastTimeOnline;
                    //update seen id:
                    _this.seen_id = data.seen_id;
                }
                else {
                    console.log(data.msg);
                }
            });
        }, 500);
    };
    ChatComponent.prototype.lastSeen = function (message_id) {
        if (String(message_id) == String(this.seen_id))
            return true;
        else
            return false;
    };
    ChatComponent.prototype.loadMessages = function (data) {
        return this.serverService.loadOldMessages(data);
    };
    ChatComponent.prototype.scrollDown = function () {
        var box = document.getElementById('box');
        box.scrollTop = box.scrollHeight;
    };
    ChatComponent.prototype.sendMessage = function () {
        var _this = this;
        console.log(this.message);
        var wrapper = {
            to: this.chat_person_id,
            message: this.message,
            toUsername: this.chat_person_username
        };
        this.send(wrapper).subscribe(function (data) {
            _this.message = ""; //not to see same message again.      
            //add real time to this message      
            _this.Messages.push(data.message);
            _this.scroll();
        });
    };
    ChatComponent.prototype.scroll = function () {
        var _this = this;
        setTimeout(function () {
            _this.scrollDown();
        }, 0);
    };
    ChatComponent.prototype.send = function (data) {
        return this.serverService.sendMessagee(data);
    };
    ChatComponent.prototype.calcClass = function (message) {
        var classes = ['ml-auto', 'mb-3'];
        if (message.to == this.chat_person_id)
            return classes;
    };
    ChatComponent.prototype.calcClass1 = function (message) {
        var classes = ['ml-3'];
        if (message.to != this.chat_person_id)
            return classes;
    };
    ChatComponent.prototype.calcClass2 = function (message) {
        var dark = ['bg-dark'];
        var primary = ['bg-primary'];
        if (message.to == this.chat_person_id)
            return primary;
        else
            return dark;
    };
    ChatComponent.prototype.showPicture = function (image) {
        var _this = this;
        var reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = function (_event) {
            _this.pictureURL = _this.sanitizer.bypassSecurityTrustUrl("" + reader.result);
        };
    };
    ChatComponent.prototype.calcPictureStyle = function (message) {
        var dont_need_picture = {
            'display': 'none'
        };
        if (message.to == this.chat_person_id) {
            return dont_need_picture;
        }
        else { //else style picture 
            return {};
        }
    };
    ChatComponent = __decorate([
        core_1.Component({
            selector: 'app-chat',
            templateUrl: './chat.component.html',
            styleUrls: ['./chat.component.css']
        })
    ], ChatComponent);
    return ChatComponent;
}());
exports.ChatComponent = ChatComponent;
