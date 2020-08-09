import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {

  constructor(
    private router: Router
  ) { }

  displayNavbar(): boolean {
    if (this.router.url === '/user/register' || this.router.url === '/user/login') return false;
    return true;
  }
}
