import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { FlashMessage } from 'angular2-flash-messages/module/flash-message';
import { ServerService } from 'src/app/services/server.service';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { ValidateService } from 'src/app/services/validate.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {
  title: string = 'register page.';
  name: string;
  surname: string;
  username: string;
  email: string;  
  address: string;  
  img: File;
  imgUrl: any;
  avatarName: string = "";

  constructor(
    private validateService: ValidateService,
    private flashMessage: FlashMessagesService,
    private serverService: ServerService,
    private sharedService: SharedDataService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const user = this.sharedService.getProfileUser();
    this.setValues(user);
    this.serverService.getAvatarImage({avatarName: this.avatarName}).subscribe((picture) => {
      let reader = new FileReader();
      reader.readAsDataURL(picture);
      reader.onload = (_event) => {
      this.imgUrl = reader.result;
    }  
    })
  }

  setValues(user: any): void {
    this.name = user.name;
    this.username = user.username;
    this.email = user.email;
    this.surname = user.surname;
    this.address = user.address;
    this.avatarName = user.avatarName;
  }

  onSubmit(){
    var fdata = new FormData();

    const user = {
      name: this.name,
      surname: this.surname,
      email: this.email,
      username: this.username,      
      address: this.address,            
      previousAvatar: this.avatarName
    }

    if (!this.validateService.validateEmail(user.email)){
      this.flashMessage.show('Please provide valid email!', { cssClass: 'alert-danger', timeout: 3000 });
      return false;
    }
    
    for (let key in user){
      fdata.append(key, user[key]);
    }

    fdata.append('file', this.img);

    this.serverService.updateRegisterData(fdata).subscribe((data: any) => {
      if (data.success) {
        this.flashMessage.show('Info updated successfully!', {cssClass: 'alert-success flashMessages', timeout: 2000});
        this.router.navigate(['/user/profile']);
      } else {
        this.flashMessage.show(data.msg, { cssClass: 'alert-danger flashMessages', timeout: 2000 });
      }
    })
  }

  fileSelected(event){
    if (event.target.files.length > 0){
      const file = <File>event.target.files[0];
      this.img = file;
    }
    let reader = new FileReader();
    reader.readAsDataURL(this.img);
    reader.onload = (_event) => {
      this.imgUrl = reader.result;
    }
  }
}
