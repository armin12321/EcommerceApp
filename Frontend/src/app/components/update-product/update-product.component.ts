import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Observable } from 'rxjs';
import { ServerService } from 'src/app/services/server.service';
import { SharedDataService } from 'src/app/services/shared-data.service';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css']
})
export class UpdateProductComponent implements OnInit {
  product: any = {};
  key: string = "";
  value: string = "";
  categories: Array<any> = [];
  optionText: string = "";
  photos: Array<any> = [];
  photoURLs: Array<any> = [];
  offset: number = 0;

  constructor(
    private sharedService: SharedDataService,
    private sanitizer: DomSanitizer,
    private serverService: ServerService,
    private router: Router,
    private flashMessages: FlashMessagesService
  ) { }

  ngOnInit(): void {
    this.product = this.sharedService.getProduct();
    console.log(this.product);

    //vrati mi sve kategorije:
    this.serverService.getOlxKategorije({kategorije: []}).subscribe((data) => {
      this.categories = data.kategorije;
      console.log(data);
      this.optionText = "Select a category";
    })

    //vrati slike mog producta da ih mogu displejati....
    for (let i = 0; i < this.product.images.length; i++) {
      let url = this.product.images[i];

      this.photoURLs.push("");
      this.offset += 1;

      //zapamtiti ću odmah sve slike, pa kad ih budem vraćo izbrisati sve koje već postoje, a snimiti nove
      this.serverService.getProductPicture({url: url}).subscribe((picture) => {
        this.photos.push(<File>picture);
        this.imgPreview(picture, i);
      });
    }
  }

  onSubmit(): any {
    console.log('submiit!');
    let fdata = new FormData();

    //add photos
    for (let i = 0; i < this.photos.length; i++){
      fdata.append('file', this.photos[i]);
    }    

    //add updated product
    fdata.append('product', JSON.stringify(this.product));

    //send it to the server
    this.serverService.updateProductData(fdata).subscribe((data) => {
      console.log(data);
      this.flashMessages.show('Updated product successfully', {cssClass: 'flashMessages alert-success', timeout: 1500});
      this.router.navigate(['/user/products']);
    })
  }

  removeImage(index: number): void {
    //remove it from photoURLs array
    this.photoURLs = this.photoURLs.filter((element, ind) => {
      if (ind == index)
        return false;
      else
        return true;
    });

    //remove it from the photos array
    this.photos = this.photos.filter((element, ind) => {
      if (ind == index)
        return false;
      else 
        return true;
    });
  }

  filesSelected(event: any): any {
    if (event.target.files.length > 0){
      for (let i = 0; i < event.target.files.length; i++){
        this.photos.push(<File>event.target.files[i]);
        this.photoURLs.push("");
        this.imgPreview(<File>event.target.files[i], this.photoURLs.length - 1);
      }
    }
    console.log(this.photoURLs);
  }

  addPair(): any {
    if (this.key.length > 1 && this.value.length > 1) {
      this.product.infoObjects.push({
        key: this.key,
        value: this.value
      });
    }
  }

  removeItem(ind: number): void {
    this.product.infoObjects = this.product.infoObjects.filter((element, index) => {
        if (index == ind)
          return false;
        else
          return true;
    });
  }

  getKategorije(): Observable<any> {
    //get categories:
    let wrapper = {
      kategorije: this.product.categories
    };
    return this.serverService.getOlxKategorije(wrapper);
  }

  addCategory(event: any): void {
    this.product.categories.push(event.target.value);

    this.getKategorije().subscribe((data) => {
      if (data.success) {
        this.categories = data.kategorije;
        this.optionText = "Now select a subcategory";
      } else {
        console.log(data.msg);
      }
    })
  }

  changeCategory(): void {
    let button = document.getElementById('button');
    let categ = document.getElementById('categories');

    button.style.display = "none";
    categ.style.display = "block";
    this.product.categories = [];
  }

  imgPreview(img: File, index: number){
    let reader = new FileReader();
    reader.readAsDataURL(img);
    reader.onload = (_event) => {
      this.photoURLs[index] = this.sanitizer.bypassSecurityTrustUrl(`${reader.result}`);
    }
  }
}
