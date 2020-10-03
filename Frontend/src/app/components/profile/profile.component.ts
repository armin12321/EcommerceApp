import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../services/server.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';
import { Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/app/services/shared-data.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {  
  avatarImage: any = "";
  user: any = {};

  constructor(
    private serverService: ServerService,
    private flashMessages: FlashMessagesService,
    private router: Router,
    private tokenService: TokenService,
    private sanitizer: DomSanitizer,
    private sharedService: SharedDataService
  ) { }

  ngOnInit(): void {
    if (this.tokenService.expiredToken()) {
      this.router.navigate(['/public/home']);
    } else {
      this.getData();
    }
  }

  getData(): void {
    this.serverService.getProfileData().subscribe((data) => {
      let css = 'alert-success';    
      console.log(data);

      if (data.success === true) {
        //fulfill the html file with data.
        console.log(data.user);

        this.user = data.user;
        
        this.getAvatarImage(this.user.avatarName).subscribe((picture) => {
          this.showImage(picture);
        })
      } else {
        console.log(data.msg);
        css = 'alert-danger';
        this.router.navigate(['public/home']);
      }
      this.flashMessages.show(data.msg, {cssClass: `flashMessages ${css}`, timeout: 3000});        
    });
  }
  showImage(picture: any) {
    // throw new Error('Method not implemented.');
    let reader = new FileReader();
    reader.readAsDataURL(picture);
    reader.onload = (_event) => {      
      this.avatarImage = this.sanitizer.bypassSecurityTrustUrl(`${reader.result}`);
    };
  }

  getAvatarImage(avatarName): Observable<any> {
    return this.serverService.getAvatarImage({avatarName});
  }

  goToUpdateUser(): void {
    this.sharedService.setProfileUser(this.user);
    this.router.navigate(['/user/updateInfo']);
  }
}
