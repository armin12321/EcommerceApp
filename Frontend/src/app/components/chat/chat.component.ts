import { Component, OnInit, Sanitizer } from '@angular/core';
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
export class ChatComponent implements OnInit {
  chat_person_id: string = "";
  user_id: string = "";
  chat_person_username: string = "";
  message: string = "";
  Messages: Array<any> = [];
  pictureURL: any = "";

  constructor(
    private serverService: ServerService,
    private sharedData: SharedDataService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) { }

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
      if (data.msg === "not authorized") {
        this.router.navigate(['/public/home']);
      } else {
        if (data.msg === "loaded messages successfully") {
          console.log(data);
          this.Messages = data.messages;

          //get your element by id , and then scroll to bottom: //still not working.
          this.scrollDown();

        } else {
          console.log(data.msg);
        }
      }
    });
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
      message: this.message
    };

    let d = new Date();

    let time = `${d.getHours()}:${d.getMinutes()} - ${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`;
    
    let newMsg = {
      time: time,
      msg: this.message,
      to: this.chat_person_id
    }

    this.Messages.push(newMsg);
    
    this.send(wrapper).subscribe((data) => {
      console.log(data);
      this.message = "";
      this.scrollDown();
    });
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
    let dont_need_picture = {
      'display': 'none'
    }
    if (message.to == this.chat_person_id) {
      return dont_need_picture;
    } else {
      return {};
    }
  }
} 

