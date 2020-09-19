import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavbarService } from '../../services/navbar.service';
import { TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AfterContentChecked } from '@angular/core';
import { ServerService } from 'src/app/services/server.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, AfterContentChecked, OnDestroy {
  title: string = 'navbar';
  currentUrl: string;
  modalRef: BsModalRef;
  username: string = '';
  numOfMessages: number;
  myInterval: number;

  constructor(    
    public navbarService: NavbarService,    
    private modalService: BsModalService,
    private flashMessages: FlashMessagesService,
    private serverService: ServerService
  ) {  }

  ngOnInit(): void {
    let that = this;

    window.addEventListener('beforeunload', function (e) {       
      if (that.navbarService.loggedIn())
          that.changeOnlineStatus(false).subscribe();
    }); 

    if (this.navbarService.loggedIn()) //if i'm logged in, and navbar is initialized
        this.changeOnlineStatus(true).subscribe();

    this.username = this.navbarService.getUsername(); 
    this.getMessages();
  }

  getMessages(): void {
    //throw new Error('Method not implemented.')
    this.myInterval = setInterval(() => {
      if (!this.navbarService.loggedIn())
        return;

      this.serverService.getNotifications().subscribe((data: any) => {
        if (data.success) {
          this.numOfMessages = data.numOfMessages
        } else {
          console.log(data.msg);
        }
      });
    }, 600);
  }

  ngOnDestroy(): void {
    clearInterval(this.myInterval);
  }

  changeOnlineStatus(b: Boolean): Observable<any> {
    return this.serverService.changeOnlineStatus({online: b});
  }

  ngAfterContentChecked() { //provjerava vise puta, nakon ucitavanja svake od komponenata.
    let elem = document.getElementById('mybutton');
    if (elem != null) {
      this.showGreeting();
    }
    this.username = this.navbarService.getUsername();
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template,{ backdrop: 'static', keyboard: false });
  }

  logout(): any {
    this.changeOnlineStatus(false).subscribe();
    this.username = '';
    this.modalRef.hide();
    this.navbarService.logOut();
    this.flashMessages.show('Logout successful', {cssClass: 'alert-success', timeout: 5000});
  }

  showGreeting(): any {
    let element = document.getElementById('mybutton');
    
    if (this.navbarService.loggedIn() && window.innerWidth > 990) {
      element.style.display = 'inline-block';
    } else {
      element.style.display = 'none';
    }
  }
}
