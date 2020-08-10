import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {

  constructor(
    private router: Router,
    private tokenService: TokenService
  ) { }

  displayNavbar(): boolean {
    if (this.router.url === '/user/register' || this.router.url === '/user/login') return false;
    return true;
  }

  loggedIn(): boolean {
    if (this.tokenService.expiredToken()) {
      return false;
    } else {
      return true;
    }
  }
}
