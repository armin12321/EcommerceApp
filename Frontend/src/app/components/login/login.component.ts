import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../services/server.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { TokenService } from '../../services/token.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  title: string = 'login page.';
  username: string;
  password: string;

  constructor(
    private serverService: ServerService,
    private router: Router,
    private flashMessage: FlashMessagesService,
    private tokenService: TokenService
  ) { }

  ngOnInit(): void {
    if (this.tokenService.expiredToken() === false) {
      this.router.navigate(['/public/home']);
    }
  }

  onSubmit(): void {
    const credentials = {
      username: this.username,
      password: this.password
    };

    this.serverService.postLoginData(credentials).subscribe((data) => {
      if (data.success == true) {                
        this.tokenService.storeUserData(data.token, data.user);  
        this.flashMessage.show('You are now logged in', {cssClass: 'alert-success', timeout: 5000});
        this.router.navigate(['/public/home']); //ako sve bude u redu.
      } else {
        this.flashMessage.show(data.msg, { cssClass: 'alert-danger', timeout: 3000 });      
        this.router.navigate(['/user/login']);
      }
    });

    
  }
}
