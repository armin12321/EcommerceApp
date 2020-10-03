import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ServerService } from '../../services/server.service';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';
import { Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  carts: Array<any> = [];  
  pictures: Array<any> = [];
  subtotal: number = 0;
  quantities: Array<any> = [];

  constructor(
    private serverService: ServerService,
    private flashMessages: FlashMessagesService,
    private router: Router,
    private tokenService: TokenService,
    private sanitizer: DomSanitizer
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
        //ovdje manipuliramo podacima koje dobijemo iz košarice
        console.log(data);
        this.carts = [];
        this.carts = data.carts;
        this.subtotal = 0;
        this.quantities = [];
        this.pictures = [];

        //get pictures for carts:
        for (let i = 0; i < this.carts.length; i++) {
          let url = this.carts[i].product.images[0];
          this.pictures.push("");
          this.subtotal += this.carts[i].quantity * this.carts[i].product.price;

          this.quantities.push(this.carts[i].quantity);

          this.getPicture({url: url}).subscribe((picture) => {
            this.imgPreview(picture, i);
          });
        }

      } else { //not real type of account.
        this.router.navigate(['public/home']);
        css = 'alert-danger';
      }
      this.flashMessages.show(data.msg, {cssClass:`flashMessages ${css}`, timeout: 3000});        
    });
  }

  deleteCart(index: number): void {
    console.log('deleted cart');
    //change subtotal value:
    this.subtotal -= this.carts[index].quantity * this.carts[index].product.price;

    //remove item from the database
    this.deleteCartByID(this.carts[index]._id).subscribe((data) => {
      console.log(data);
    })

    this.pictures = this.pictures.filter((element, ind) => {
      if (ind != index)
        return true;
      else  
        return false;
    });

    this.carts = this.carts.filter((element, ind) => {
      if (ind != index)
        return true;
      else
        return false;
    });

    this.quantities = this.quantities.filter((element, ind) => {
      if (ind != index)
        return true;
      else 
        return false;
    });
  }

  deleteCartByID(cart_id: any): Observable<any> {
      return this.serverService.deleteCartByID({ID: cart_id});
  }

  updateCartQuantity(cart_id: any, quantity: number): Observable<any> {
    return this.serverService.updateCartQuantity({
      ID: cart_id,
      quantity: quantity
    });
  }

  changeQuantity(index: number): void {
    console.log('changed quantity!!!');
    //change subtotal value:
    this.subtotal += (this.quantities[index] - this.carts[index].quantity) * this.carts[index].product.price;

    //update the latter value
    this.carts[index].quantity = this.quantities[index];

    //change it in the database:
    this.updateCartQuantity(this.carts[index]._id, this.carts[index].quantity).subscribe((data) => {
      console.log(data);
    });
  }

  getPicture(data: any): Observable<any> {
    return this.serverService.getProductPicture(data);
  }

  imgPreview(img: File, index: number){
    let reader = new FileReader();
    reader.readAsDataURL(img);
    reader.onload = (_event) => {      
      this.pictures[index] = this.sanitizer.bypassSecurityTrustUrl(`${reader.result}`);
    };
  }

  goShopping(): void {
    this.router.navigate(['/public/home']);
  }

  checkout(): void {
    console.log('checkout!!');
  }
}  
