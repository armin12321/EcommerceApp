import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../services/server.service';
import { AfterContentChecked } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from '../../services/shared-data.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-seller-info',
  templateUrl: './seller-info.component.html',
  styleUrls: ['./seller-info.component.css']
})
export class SellerInfoComponent implements OnInit, AfterContentChecked {
  user: any = {};
  avatarURL: any = "";

  constructor(
    private sanitizer: DomSanitizer,
    private serverService: ServerService,
    private sharedData: SharedDataService
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  ngAfterContentChecked(): void {
    //Here change some of the classes to display nicely
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
		  //after that, return his top 5 - 10 products.

	  } else {
		  console.log(data.msg);
	  }
    });
  }

  getAvatarImage(avatarName): Observable<any> {
	return this.serverService.getAvatarImage({avatarName});
  }

  resize(): void { 
    //resize event handler - for displaying nicely.
  }

  imgPreview(img: File){
    let reader = new FileReader();
    reader.readAsDataURL(img);
    reader.onload = (_event) => {      
      this.avatarURL = this.sanitizer.bypassSecurityTrustUrl(`${reader.result}`);
    };
  }
}
