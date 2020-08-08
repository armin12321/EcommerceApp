import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../services/server.service';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  email: string = '';
  password: string = '';
  username: string = '';

  constructor(
    private serverService: ServerService,
    private flashMessages: FlashMessagesService
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.serverService.getProfileData().subscribe((data) => {
      let css = 'alert-success';
      if (!data.user.username) {
        css = 'alert-danger';
      }
      this.flashMessages.show(data.msg, {cssClass: css, timeout: 3000});        
      this.email = data.user.email;
      this.username = data.user.username;
      this.password = data.user.password;
    });
  }
}
