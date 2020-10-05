import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { TemplateRef } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ServerService } from '../../services/server.service';
import { Router } from '@angular/router';

import { types } from '../../configs/types.config'
import { TokenService } from 'src/app/services/token.service';
import { Observable } from 'rxjs';
import { SharedDataService } from 'src/app/services/shared-data.service';

@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.component.html',
  styleUrls: ['./addproduct.component.css']
})
export class AddproductComponent implements OnInit {

  name: string;
  manufacturer: string;
  price: number;
  available: number;
  description: string;
  condition: string;
  photos: Array<File> = [];
  imgPreviewUrl: any;
  currentPhoto: any = 0;
  numberOfPhotos: any;
  modalRef: BsModalRef;
  choosenPhotos: string = '';
  new: boolean;
  used: boolean;
  user: Object;
  categories: Array<String> = [];
  descriptionObject: Object = {};
  optionText: string = "";
  keyValueArray: Array<any> = [];
  key: string = "";
  value: string = "";

  constructor(
    private modalService: BsModalService,
    private flashMessage: FlashMessagesService,
    private serverService: ServerService,
    private router: Router,
    private tokenService: TokenService,
    public sharedData: SharedDataService
    ) { }

  ngOnInit(): void {
    this.user = this.tokenService.getUser();
    console.log(this.user);
    this.getKategorije().subscribe((data) => {
      if (data.success) {
        this.categories = data.kategorije;
        this.optionText = "Select a category";
      } else {
        console.log(data.msg);
      }
    });
  }

  getKategorije(): Observable<any> {
    //get breadcrumbs:
    let wrapper = {
      kategorije: this.sharedData.breadcrumbs1
    };
    return this.serverService.getOlxKategorije(wrapper);
  }

  addCategory(event: any): void {
    this.sharedData.addBreadcrumb1(event.target.value);    
    this.getKategorije().subscribe((data) => {
      if (data.success) {
        this.categories = data.kategorije;
        this.optionText = "Now select a subcategory";
      } else {
        console.log(data.msg);
      }
    })
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

  removeItem(item: any): void {
    this.keyValueArray = this.keyValueArray.filter((element) => {
        if (element.key == item.key && element.value == item.value)
          return false;
        else 
          return true;
    });
  }

  onSubmit(){
    var fdata = new FormData();

    const product = {
      name: this.name,
      manufacturer: this.manufacturer,
      price: this.price,
      available: this.available,
      condition: this.condition,
      description: this.description,
    };

    for (let i = 0; i < this.numberOfPhotos; i++){
      fdata.append('file', this.photos[i]);
    }    
    
    for (let key in this.user){
      fdata.append(key, this.user[key]);
    }

    fdata.append('user', JSON.stringify(this.user));

    for (let key in product){
      fdata.append(key, product[key]);
    }

    fdata.append('categories', JSON.stringify(this.sharedData.breadcrumbs1));
    fdata.append('infoObjects', JSON.stringify(this.keyValueArray));
    
    this.serverService.postProductData(fdata).subscribe(data => {
      if (data.success){
        this.flashMessage.show('Added product successfully', { cssClass: 'flashMessages alert-success', timeout: 1500 });
        this.router.navigate(['/user/products']);
      }else {
        this.flashMessage.show(data.msg, { cssClass: 'flashMessages alert-danger', timeout: 1500 });
      }
    });
  }

  filesSelected(event, template){
    if (event.target.files.length > 0){
      this.numberOfPhotos = event.target.files.length;
      for (let i = 0; i < this.numberOfPhotos; i++){
        this.photos.push(<File>event.target.files[i]);
      }
    }
    console.log(this.photos);
    this.imgPreview(this.photos[this.currentPhoto]);
    this.openModal(template);
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template,{ backdrop: 'static', keyboard: false });
  }

  nextImage(): void{
    this.currentPhoto += 1;
    this.currentPhoto %= this.numberOfPhotos;
    this.imgPreview(this.photos[this.currentPhoto]);
  }

  previousImage(): void {
    this.currentPhoto -= 1;
    if (this.currentPhoto <= -1) this.currentPhoto = this.numberOfPhotos - 1;
    this.imgPreview(this.photos[this.currentPhoto]);
  }

  removeImage(): void {
    this.photos.splice(this.currentPhoto, 1);
    this.currentPhoto -= 1;
    this.numberOfPhotos -= 1;
    if (this.numberOfPhotos == 0) {
      this.currentPhoto = 0;
      this.modalRef.hide();
      return;
    }
    if (this.currentPhoto == -1) this.currentPhoto = this.numberOfPhotos - 1;
    this.imgPreview(this.photos[this.currentPhoto]);
  }

  ok(): void {
    for (let i = 0; i < this.numberOfPhotos; i++){
      this.choosenPhotos += this.photos[i]['name'];
      this.choosenPhotos += ', ';

    }
    console.log(this.choosenPhotos);
    this.modalRef.hide();
  }

  imgPreview(img: File){
    let reader = new FileReader();
    reader.readAsDataURL(img);
    reader.onload = (_event) => {
      this.imgPreviewUrl = reader.result;
    }
  }

}
