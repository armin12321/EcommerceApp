import { AfterContentChecked, Component, OnInit, TemplateRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { NavbarService } from 'src/app/services/navbar.service';
import { ServerService } from 'src/app/services/server.service';
import { SharedDataService } from 'src/app/services/shared-data.service';

@Component({
  selector: 'app-product-info',
  templateUrl: './product-info.component.html',
  styleUrls: ['./product-info.component.css']
})
export class ProductInfoComponent implements OnInit, AfterContentChecked {
  avatarURL: any = "";
  currentPhoto: number = 0;
  photos: Array<any> = [];
  numberOfPhotos: number = 0;
  modalRef: BsModalRef;
  product: any = {};
  ago: string = "";

  constructor(
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private sharedService: SharedDataService,
    private serverService: ServerService,
    private router: Router,
    private navbarService: NavbarService,
    private flashMessages: FlashMessagesService
  ) { }

  ngOnInit(): void {
    //get info about the product
    this.getData();
  }

  ngAfterContentChecked(): void {
    //Here change some of the classes to display nicely
    let avatarImage = document.getElementById('avatarImage');
    let userInfo = document.getElementById('info');
    let description = document.getElementById('description');
    let characteristics = document.getElementById('characteristics');

    if (avatarImage != null && userInfo != null && description != null && characteristics != null) { //loaded
      this.resize();
    }
  }

  getData(): void {
    let productID = this.sharedService.getProductID();
    let wrapper = {
      productID: productID
    };

    this.getProduct(wrapper).subscribe((data) => {
      if (data.success) {
        console.log(data);
        this.product = data.product;
        this.ago = data.ago;
        this.numberOfPhotos = data.product.images.length;

        for (let i = 0; i < this.numberOfPhotos; i++) {
          let avatarName: string = data.product.images[i];
          this.photos.push("");

          this.serverService.getProductPicture({url: avatarName}).subscribe((picture) => {
            console.log(picture);
            this.imgPreview(picture, i);
            if (i == 0)
              this.showFirstImage(picture);
          })
        }

        if (this.product.available == 0 || !this.navbarService.loggedIn() || !this.navbarService.isBuyer()) {
          let btn = document.getElementById('cart');
          btn.setAttribute("disabled", "");
        }
      } else {
        console.log(data.msg);
      }
    })
  }

  addToCart(): void {
    console.log('added to cart!!!!'); //kasnije srediti.

    //za cart nam treba : proizvod koji se kupuje, onaj ko ga kupuje, te količina proizvoda
    //pošto se može kupiti samo ukoliko sam logovan, znači da se šalje ID, pa ja trebam samo proizvod poslati.
    let wrapper = {
      quantity: 1,
      product: this.product
    };

    this.serverService.addToCart(wrapper).subscribe((data: any) => {      
      if (data.success) {
        console.log(data);
        if (data.msg == 'already exists') {
          this.flashMessages.show('Already in the cart', {cssClass: 'flashMessages alert-danger', timeout: 2000});  
        } else {
          this.flashMessages.show('Successfully added to cart', {cssClass: 'flashMessages alert-success', timeout: 2000});
        }        
      } else {
        console.log(data.msg);
      }
    });
  }

  getProduct(data): Observable<any> {
    return this.serverService.getProductByID(data);
  }

  resize(): void { 
    //resize event handler - for displaying nicely.
    let column = document.getElementById('avatarImage');
    let description = document.getElementById('description');
    let characteristics = document.getElementById('characteristics');

    if (window.innerWidth < 600) {
      if (!column.classList.contains('col-12')) column.classList.add('col-12');
      if (column.classList.contains('col-6'))   column.classList.remove('col-6');

      if (description.classList.contains('col-6')) description.classList.remove('col-6');
      if (!description.classList.contains('col-12')) description.classList.add('col-12');

      if (characteristics.classList.contains('col-6')) characteristics.classList.remove('col-6');
      if (!characteristics.classList.contains('col-12')) characteristics.classList.add('col-12');
    } else {
      if (!column.classList.contains('col-6')) column.classList.add('col-6');
      if (column.classList.contains('col-12')) column.classList.remove('col-12');

      if (!description.classList.contains('col-6')) description.classList.add('col-6');
      if (description.classList.contains('col-12')) description.classList.remove('col-12');

      if (!characteristics.classList.contains('col-6')) characteristics.classList.add('col-6');
      if (characteristics.classList.contains('col-12')) characteristics.classList.remove('col-12');
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

  imgPreview(img: File, index: number){
    let reader = new FileReader();
    reader.readAsDataURL(img);
    reader.onload = (_event) => {            
      this.photos[index] = this.sanitizer.bypassSecurityTrustUrl(`${reader.result}`);
    };
  }

  showFirstImage(img: File){
    let reader = new FileReader();
    reader.readAsDataURL(img);
    reader.onload = (_event) => {            
      this.avatarURL = this.sanitizer.bypassSecurityTrustUrl(`${reader.result}`);
    };
  }

  pictureStyle(): object {
    return {
      'border-radius': '120px 20px 120px 20px'
    };
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template,{ backdrop: 'static', keyboard: false });
  }

  nextImage(): void{
    this.currentPhoto += 1;
    this.currentPhoto %= this.numberOfPhotos;
  }

  previousImage(): void {
    this.currentPhoto -= 1;
    if (this.currentPhoto <= -1) this.currentPhoto = this.numberOfPhotos - 1;
  }

  visitSeller() {
    this.sharedService.setSellerID(this.product.user._id);
    this.router.navigate(['/public/sellerInfo']);
  }
}
