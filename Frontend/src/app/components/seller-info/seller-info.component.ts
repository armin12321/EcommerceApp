import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../services/server.service';
import { AfterContentChecked } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from '../../services/shared-data.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seller-info',
  templateUrl: './seller-info.component.html',
  styleUrls: ['./seller-info.component.css']
})
export class SellerInfoComponent implements OnInit, AfterContentChecked {
  user: any = {};
  avatarURL: any = "";
  products: Array<any> = [];
  imageURLs: any = [];

  constructor(
    private sanitizer: DomSanitizer,
    private serverService: ServerService,
    private sharedData: SharedDataService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  ngAfterContentChecked(): void {
    //Here change some of the classes to display nicely
    let avatarImage = document.getElementById('avatarImage');
    let userInfo = document.getElementById('info');
    if (avatarImage != null && userInfo != null) { //loaded
      this.resize();
    }
  }

  getData(): void {
    //firstly, get data about the seller
    let wrapper = {
      _id: this.sharedData.getSellerID()
    }

    this.serverService.getSellerData(wrapper).subscribe((data) => {
	  console.log(data);
	  if (data.success) {
		  this.user = data.user; // this is gonna display in html.
		  this.getAvatarImage(this.user.avatarName).subscribe((picture) => {
			this.imgPreview(picture);				  
		  })
      //We will return top 10 most purchased products of this seller.
      this.serverService.getTopProducts(wrapper).subscribe((data) => {
        console.log(data);
        this.products = data.products;
        for (let i = 0; i < data.products.length; i++) {
          //get url of first image in the array as avatar.
          let url = data.products[i].product.images[0];
          this.imageURLs.push(''); // not to be undefined
          this.getProductPicture(url).subscribe((picture) => {
            console.log(picture);
            this.imgPreview1(picture, i);
          })
        }
      });
	  } else {
		  console.log(data.msg);
	  }
    });
  }

  getProductPicture(url: any): Observable<any> {
    return this.serverService.getProductPicture({url});
  }

  getAvatarImage(avatarName): Observable<any> {
	return this.serverService.getAvatarImage({avatarName});
  }

  setProductID(productIndex) {
    this.sharedData.setProductID(this.products[productIndex].product._id);
    this.router.navigate(['/public/productInfo']);
  }

  resize(): void { 
    //resize event handler - for displaying nicely.
    let column = document.getElementById('avatarImage');

    if (window.innerWidth < 600) {
      if (!column.classList.contains('col-12')) column.classList.add('col-12');
      if (column.classList.contains('col-6'))   column.classList.remove('col-6');
    } else {
      if (!column.classList.contains('col-6')) column.classList.add('col-6');
      if (column.classList.contains('col-12')) column.classList.remove('col-12');
    }

    column = document.getElementById('info');

    if (window.innerWidth < 600) {
      if (!column.classList.contains('col-12')) column.classList.add('col-12');
      if (column.classList.contains('col-6'))   column.classList.remove('col-6');
    } else {
      if (!column.classList.contains('col-6')) column.classList.add('col-6');
      if (column.classList.contains('col-12')) column.classList.remove('col-12');
    }
  }

  imgPreview(img: File){
    let reader = new FileReader();
    reader.readAsDataURL(img);
    reader.onload = (_event) => {      
      this.avatarURL = this.sanitizer.bypassSecurityTrustUrl(`${reader.result}`);
    };
  }

  imgPreview1(img: File, index: number) {
    let reader = new FileReader();
    reader.readAsDataURL(img);
    reader.onload = (_event) => {      
      this.imageURLs[index] = this.sanitizer.bypassSecurityTrustUrl(`${reader.result}`);
    };
  }
}
