import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ServerService } from '../../services/server.service';

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
    private flashMessages: FlashMessagesService
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.serverService.getCartData().subscribe((data) => {
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
