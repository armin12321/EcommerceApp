import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ServerService } from '../../services/server.service';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
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
      this.router.navigate(['public/home']);
    } else {
      this.getData();
    }
  }

  getData(): void {
    this.serverService.getCartData().subscribe((data) => {
      let css = 'alert-success';
      console.log(data);

      if (data.success === true) { //it is authorized, and right type of account.
        this.email = data.user._id;
        this.username = data.user.username;
        this.password = data.user.type;
      } else { //not real type of account.
        this.router.navigate(['public/home']);
        css = 'alert-danger';
      }
      this.flashMessages.show(data.msg, {cssClass: css, timeout: 3000});        
    });
  }
}  


