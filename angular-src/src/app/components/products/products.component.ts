import { Component, OnInit } from '@angular/core';
import { ServerService } from 'src/app/services/server.service';
import { TokenService } from 'src/app/services/token.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  message: string;
  constructor(
    private serverService: ServerService,
    private tokenService: TokenService,
    private flashMessages: FlashMessagesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.tokenService.expiredToken()) {
      this.router.navigate(['/public/home']);
    } else {
      this.getData();
    }
  }

  getData(): any {
    this.serverService.getMyProducts().subscribe((data) => {
      let css = 'alert-success';
      console.log(data);
      

      if (data.success == true) {
        this.message = data.msg;
      } else {
        css = 'alert-danger';
        this.router.navigate['/public/home'];
      }
      this.flashMessages.show(data.msg, { cssClass: css, timeout: 3000 });
    });
  }
}
