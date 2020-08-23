import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../services/server.service';
import { AfterContentChecked } from '@angular/core';
import { Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterContentChecked {
  title: string = 'homepage';
  // heroes: Array<Number> = [1, 2, 3, 4, 5, 3, 4, 4];
  products: Array<Object>;

  imageURLs: Array<any> = [];

  constructor(
    private serverService: ServerService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  ngAfterContentChecked(): void {
    let column = document.getElementById('column');
    if (column != null) { //ucitan je.
      this.resize();
    }
  }

  getData(): void {
    this.serverService.getHomeData().subscribe((data) => {
      console.log(data);
      this.products = data.products;
      for (let i = 0; i < data.products.length; i++) {
        //get url of first image in the array as avatar.
        let url = data.products[i].product.images[0];
        this.imageURLs.push(''); // not to be undefined
        this.getProductPicture(url).subscribe((picture) => {
          this.imgPreview(picture, i);
        })
      }
    });
  }

  getProductPicture(url: any): Observable<any> {
    const objectt = {
      url: url
    };
    return this.serverService.getProductPicture(objectt);    
  }

  resize(): void {
    let column = document.getElementById('column');
    if (window.innerWidth < 1100) {
      if (!column.classList.contains('col-12'))
          column.classList.add('col-12')
      if (column.classList.contains('col-9'))    
          column.classList.remove('col-9')
    } else {
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
}
