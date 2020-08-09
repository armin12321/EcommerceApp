import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../../services/token.service';
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
    private tokenService: TokenService,
    private navbarService: NavbarService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  getTokenService(): TokenService{
    return this.tokenService;
  }

  displayNavbar(): boolean {
    return this.navbarService.displayNavbar();
  }

}
