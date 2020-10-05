import { Component, OnInit, TemplateRef } from '@angular/core';
import { ServerService } from 'src/app/services/server.service';
import { TokenService } from 'src/app/services/token.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SharedDataService } from 'src/app/services/shared-data.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})

export class ProductsComponent implements OnInit {
  message: string;
  products: Array<any> = [];
  pictures: Array<any> = [];
  modalRef: BsModalRef;
  tempIndex: number = 0;
  agos: Array<any> = [];

  constructor(
    private serverService: ServerService,
    private tokenService: TokenService,
    private flashMessages: FlashMessagesService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private sharedService: SharedDataService
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

        this.products = [];
        this.pictures = [];

        for (let i = 0; i < data.products.length; i++) {
          this.products.push(data.products[i].product);
          this.agos.push(data.products[i].ago);

          const url = this.products[i].images[0];

          this.pictures.push("");

          this.getProductPicture(url).subscribe((picture) => {
            this.showPicture(picture, i);
          });
        }
      } else {
        css = 'alert-danger';
        this.router.navigate['/public/home'];
      }
      this.flashMessages.show('Welcome to your products', { cssClass:'flashMessages ' + css, timeout: 1500 });
    });
  }

  showPicture(img: any, index: number): void {
    let reader = new FileReader();
    reader.readAsDataURL(img);
    reader.onload = (_event) => {      
      this.pictures[index] = this.sanitizer.bypassSecurityTrustUrl(`${reader.result}`);
    };
  }

  getProductPicture(url): Observable<any> {
    return this.serverService.getProductPicture({url: url});
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template,{ backdrop: 'static', keyboard: false });
  }

  deleteProduct(index: number): void {
    //close modal that is opened
    this.modalRef.hide();

    //delete it from the server
    this.deleteProd(this.products[index]).subscribe((data) => {
      console.log(data);
    })

    //delete it from the products variable
    this.products = this.products.filter((element, ind) => {
        if (ind == index)
          return false;
        else 
          return true;
    });

    //delete it from the pictures variable
    this.pictures = this.pictures.filter((element, ind) => {
        if (ind == index)
          return false;
        else 
          return true;
    });

    //delete it from times variable agos
    this.agos = this.agos.filter((element, ind) => {
        if (ind == index)
          return false;
        else
          return true;
    });

  }

  deleteProd(product: any): Observable<any> {
    console.log(product);
    let pr: string = JSON.stringify(product);
    return this.serverService.deleteProduct({
      product: pr
    });
  }

  setTempIndex(index: number, template: any): void {
    this.tempIndex = index;
    this.openModal(template);
  }

  goToUpdateProduct(index: any): any {
    //upamti sve informacije o produktu, te posalji ga u shared service:
    this.sharedService.setProduct(this.products[index]);    
    this.router.navigate(['../../products/update']);
  }
}
