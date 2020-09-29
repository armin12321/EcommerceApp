import { Component, OnInit, TemplateRef } from '@angular/core';
import { ServerService } from '../../services/server.service';
import { AfterContentChecked } from '@angular/core';
import { Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from '../../services/shared-data.service';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterContentChecked {
  title: string = 'homepage';
  products: Array<any>;
  imageURLs: Array<any> = [];
  condition: String = "";
  kategorije: Array<any> = [];
  keyValueArray: Array<any> = [];
  key: string = "";
  value: string = "";
  priceMin: number = 0;
  priceMax: number = 1000000;
  seller: string = "";
  manufacturer: string = "";
  prikaziFilter: boolean = true;
  modalRef: any;

  constructor(
    private serverService: ServerService,
    private sanitizer: DomSanitizer,
    public sharedData: SharedDataService,
    private router: Router,
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.getData();
    this.olxGetKategorije().subscribe((data) => {
      if (data.success) {
        console.log(data);
        this.kategorije = data.kategorije;
      } else {
        console.log(data.msg);
      }
    })
  }

  ngAfterContentChecked(): void {
    let column = document.getElementById('column');
    if (column != null) { //ucitan je.
      this.resize();
    }
  }

  removeItem(item: any): void {
    this.keyValueArray = this.keyValueArray.filter((element) => {
        if (element.key == item.key && element.value == item.value)
          return false;
        else 
          return true;
    });
  }

  addPair(): void {
    //only if they are not empty
    if (this.key.length > 1 && this.value.length > 1) {
      this.keyValueArray.push({
        key: this.key,
        value: this.value
      });
    }

    //reset them after adding
    this.key = "";
    this.value = "";
  }

  idiNaKategoriju(kategorija: string): void {
    this.olxGetKategorije().subscribe((data) => {
      console.log(data);
      if (data.success) {
        this.kategorije = data.kategorije;
        console.log(data);
      } else {
        console.log(data.msg);
      }
    })
  }

  olxGetKategorije(): Observable<any> {
    let kategorije: Array<any> = [];

    //copy categories without first one
    for (let i = 1; i < this.sharedData.breadcrumbs.length; i++) 
      kategorije.push(this.sharedData.breadcrumbs[i]);
    
    const wrapper = {
      kategorije: kategorije
    };
    return this.serverService.getOlxKategorije(wrapper);
  }

  setSellerID(productIndex) {
    this.sharedData.setSellerID(this.products[productIndex].product.user._id);
    this.router.navigate(['/public/sellerInfo']);
  }

  setProductID(productIndex) {
    this.sharedData.setProductID(this.products[productIndex].product._id);
    this.router.navigate(['/public/productInfo']);
  }

  getData(): void {
    //here we gather all the data for our search.    
    //change get to post, and then send it to the server
    let myCategories: Array<any> = [];

    //don't take first one because of the 'all' field
    for (let i = 1; i < this.sharedData.breadcrumbs.length; i++)
      myCategories.push(this.sharedData.breadcrumbs[i]);    

    let wrapper = {
      categories: myCategories,
      priceMin: this.priceMin,
      priceMax: this.priceMax,
      condition: this.condition,
      infoObjects: this.keyValueArray,
      seller: this.seller,
      manufacturer: this.manufacturer,
    };

    if (this.modalRef != undefined)
      this.modalRef.hide();

    this.serverService.getHomeData(wrapper).subscribe((data) => {
      console.log(data);
      this.products = data.products;
      this.imageURLs = [];
      for (let i = 0; i < data.products.length; i++) {
        //get url of first image in the array as avatar.
        let url = data.products[i].product.images[0];
        this.imageURLs.push(''); // not to be undefined
        this.getProductPicture(url).subscribe((picture) => {
          console.log(picture);
          this.imgPreview(picture, i);
        })
      }
    });
  }



  getProductPicture(url: any): Observable<any> {
    const wrapper = {
      url
    };
    return this.serverService.getProductPicture(wrapper);   
  }

  resize(): void {
    let column = document.getElementById('column');
    if (window.innerWidth < 1100) {
      this.prikaziFilter = false;
      if (!column.classList.contains('col-12'))
          column.classList.add('col-12')
      if (column.classList.contains('col-9'))    
          column.classList.remove('col-9')
    } else {
      this.prikaziFilter = true;
      if (!column.classList.contains('col-9'))
          column.classList.add('col-9')
      if (column.classList.contains('col-12'))    
          column.classList.remove('col-12')
    }
  }

  imgPreview(img: File, index: number){
    let reader = new FileReader();
    reader.readAsDataURL(img);
    reader.onload = (_event) => {      
      this.imageURLs[index] = this.sanitizer.bypassSecurityTrustUrl(`${reader.result}`);
    };
  }

  imageStyle(): object {
    return {
      'border-radius': '50px'
    };
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template,{ backdrop: 'static', keyboard: false });
  }
}
