import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { TemplateRef } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ServerService } from '../../services/server.service';
import { Router } from '@angular/router';

import { types } from '../../configs/types.config'
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.component.html',
  styleUrls: ['./addproduct.component.css']
})
export class AddproductComponent implements OnInit {

  name: string;
  manufactuer: string;
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

  constructor(
    private modalService: BsModalService,
    private flashMessage: FlashMessagesService,
    private serverService: ServerService,
    private router: Router,
    private tokenService: TokenService
    ) { }

  ngOnInit(): void {
    this.user = this.tokenService.getUser();
    console.log(this.user);
  }

  onSubmit(){
    var fdata = new FormData();

    const product = {
      name: this.name,
      manufactuer: this.manufactuer,
      price: this.price,
      available: this.available,
      condition: this.condition,
      description: this.description
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
    
    this.serverService.postProductData(fdata).subscribe(data => {
      if (data.success){
        this.flashMessage.show(data.msg, { cssClass: 'alert-success', timeout: 3000 });
        this.router.navigate(['/user/products']);
      }else {
        this.flashMessage.show(data.msg, { cssClass: 'alert-danger', timeout: 3000 });
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
