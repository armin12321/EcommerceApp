import { Component, OnInit } from '@angular/core';
import { NavbarService } from '../../services/navbar.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  title: string = 'navbar';
  currentUrl: string;

  constructor(    
    public navbarService: NavbarService,    
  ) { }

  ngOnInit(): void {
  }
}
