import { AfterContentChecked, Component, OnDestroy, OnInit, Sanitizer, ɵclearOverrides } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ServerService } from 'src/app/services/server.service';
import { SharedDataService } from 'src/app/services/shared-data.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy, AfterContentChecked {
  chat_person_id: string = "";
  user_id: string = "";
  chat_person_username: string = "";
  message: string = "";
  Messages: Array<any> = [];
  pictureURL: any = "";
  myInterval: any;  
  seen_id: any;
  numOfMessages: Number = 0;
  online: Boolean = false;
  lastTimeOnline: any = [];

  constructor(
    private serverService: ServerService,
    private sharedData: SharedDataService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) { }

  ngAfterContentChecked(): void {

  }

  ngOnDestroy(): void {
    clearInterval(this.myInterval);
  }

  ngOnInit(): void {
    this.chat_person_id = this.sharedData.getChatPersonID();
    this.chat_person_username = this.sharedData.getChatPersonUsername();

    //get person's avatar image, and then set it.
    console.log(this.sharedData.getChatPersonAvatarURL());
    this.serverService.getAvatarImage({avatarName: this.sharedData.getChatPersonAvatarURL()}).subscribe((picture) => {
      this.showPicture(picture);
    });

    //load all the messages that you have been typing with this guy.
    this.loadMessages({ chat_id: this.chat_person_id }).subscribe((data) => {
      //this load operation aproximatelly needs 200ms, so we can try multiple values.

      if (data.msg === "not authorized") {
        this.router.navigate(['/public/home']);
      } else {
        if (data.msg === "loaded messages successfully") {
          console.log(data);

          this.Messages = data.messages;
          this.scroll();        

        } else {
          console.log(data.msg);
        }
      }
    });

    //Get messages that keep coming.
    this.getMessages();
  }

  showModal(): Boolean {
    if (this.numOfMessages != 0)
      return true;
    else 
      return false;
  }

  goDown(): void {
    this.scroll();
    this.numOfMessages = 0;
  }

  getMessages(): any {
    // throw new Error('Method not implemented.');
    this.myInterval = setInterval(() => {            

      this.serverService.getNewMessages({chat_id: this.chat_person_id}).subscribe((data) => {
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
        } else {
          console.log(data.msg);
        }
    });
    }, 500);
  }

  lastSeen(message_id): Boolean {
    if (String(message_id) == String(this.seen_id))
      return true;
    else
      return false;
  }

  loadMessages(data): Observable<any> {
      return this.serverService.loadOldMessages(data);
  }

  scrollDown(): void {
    let box = document.getElementById('box');
    box.scrollTop = box.scrollHeight;
  }

  sendMessage(): void {
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

  scroll(): void {
    setTimeout(() => {
      this.scrollDown();
    }, 0);
  }

  send(data: any): Observable<any> {
     return this.serverService.sendMessagee(data);
  }

  calcClass(message): Array<any> {
    let classes = ['ml-auto', 'mb-3'];
    if (message.to == this.chat_person_id)
      return classes;
  }

  calcClass1(message): Array<any> {
    let classes = ['ml-3']
    if (message.to != this.chat_person_id)
      return classes;
  }

  calcClass2(message): Array<any> {
    let dark = ['bg-dark'];
    let primary = ['bg-primary'];

    if (message.to == this.chat_person_id)
      return primary;
    else 
      return dark;
  }

  showPicture(image: any): void {
    let reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = (_event) => {      
      this.pictureURL = this.sanitizer.bypassSecurityTrustUrl(`${reader.result}`);
    };
  }

  calcPictureStyle(message): any {
    const dont_need_picture = {
      'display': 'none'
    };

    if (message.to == this.chat_person_id) {
      return dont_need_picture;
    } else { //else style picture 
      return {};
    }
  }
} 

