import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NavbarService } from 'src/app/services/navbar.service';
import { ServerService } from 'src/app/services/server.service';
import { SharedDataService } from 'src/app/services/shared-data.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {
  messages: Array<any> = [];
  imgURLs: Array<any> = [];
  people: Array<any> = [];
  imgChats: Array<any> = [];

  constructor(
    private router: Router,
    private sharedService: SharedDataService,
    private serverService: ServerService,
    public navbarService: NavbarService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {    
    this.getMessagesInfo() //because that is active tab.
  }

  getMessagesInfo(){
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
          this.serverService.findByID({id}).subscribe((data) => {
            if (data.success) {
              console.log(data.avatarName);
              let avatarName = data.avatarName;
              this.messages[i].avatarName = avatarName;
              this.serverService.getAvatarImage({avatarName}).subscribe((picture) => {                                
                this.showPicture(picture, i);
              });
            } else {
              console.log(data.msg);
            }
          });
        }

      } else {
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
          this.serverService.findByID({id}).subscribe((data) => {
            if (data.success) {
              let avatarName = data.avatarName;              
              this.people[i].avatarName = avatarName;
              this.serverService.getAvatarImage({avatarName}).subscribe((picture) => {                            
                this.showPicture1(picture, i);
              });
            } else {
              console.log(data.msg);
            }
          });
        }
      } else {
        console.log(data.msg);
      }
    });
  }

  showPicture(image: any, index: number): any {
    let reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = (_event) => {      
      this.imgURLs[index] = this.sanitizer.bypassSecurityTrustUrl(`${reader.result}`);
    };
  }

  showPicture1(image: any, index: number): any {
    let reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = (_event) => {      
      this.imgChats[index] = this.sanitizer.bypassSecurityTrustUrl(`${reader.result}`);
    };
  }

  goToChat(message: any): void {
    //set our ID and usename of our chat person:
    console.log(message);
    this.sharedService.setChatPersonID(message.from);
    this.sharedService.setChatPersonUsername(message.fromUsername);
    this.sharedService.setChatPersonAvatarURL(message.avatarName);
    this.router.navigate(['/user/chat']);
  }

  goToChat1(people: any): void {
    console.log(people);
    this.sharedService.setChatPersonAvatarURL(people.avatarName);
    this.sharedService.setChatPersonID(people.messengerID);
    this.sharedService.setChatPersonUsername(people.messengerUsername);
    this.router.navigate(['user/chat']);
  }

}
