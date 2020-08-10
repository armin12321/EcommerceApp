import { Component, OnInit } from '@angular/core';
import { NavbarService } from '../../services/navbar.service';
import { TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  title: string = 'navbar';
  currentUrl: string;
  modalRef: BsModalRef;

  constructor(    
    public navbarService: NavbarService,    
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template,{ backdrop: 'static', keyboard: false });
  }

  logout(): any {
    this.modalRef.hide();
    this.navbarService.logOut();
  }
}
