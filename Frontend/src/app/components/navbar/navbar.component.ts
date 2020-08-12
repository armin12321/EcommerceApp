import { Component, OnInit } from '@angular/core';
import { NavbarService } from '../../services/navbar.service';
import { TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AfterContentChecked } from '@angular/core';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, AfterContentChecked {
  title: string = 'navbar';
  currentUrl: string;
  modalRef: BsModalRef;
  username: string = '';
  numOfMessages: number;

  constructor(    
    public navbarService: NavbarService,    
    private modalService: BsModalService,
    private flashMessages: FlashMessagesService
  ) {  }

  ngOnInit(): void {
    this.username = this.navbarService.getUsername(); 
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
