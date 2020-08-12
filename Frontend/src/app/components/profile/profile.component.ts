import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../services/server.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';

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
    private flashMessages: FlashMessagesService,
    private router: Router,
    private tokenService: TokenService
  ) { }

  ngOnInit(): void {
    if (this.tokenService.expiredToken()) {
      this.router.navigate(['/public/home']);
    } else {
      this.getData();
    }
  }

  getData(): void {
    this.serverService.getProfileData().subscribe((data) => {
      let css = 'alert-success';    
      console.log(data);

      if (data.success === true) {
        this.email = data.user._id;
        this.username = data.user.username;
        this.password = data.user.type;
      } else {
        css = 'alert-danger';
        this.router.navigate(['public/home']);
      }
      this.flashMessages.show(data.msg, {cssClass: css, timeout: 3000});        
    });
  }
}
