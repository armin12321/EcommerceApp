import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from './token.service';
import { types } from '../configs/types.config'

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

  logOut(): void {
    this.tokenService.deleteToken();    
    this.router.navigate(['public/home']);    
  }  

  isBuyer(): boolean {
    const user: any = this.tokenService.getUser();

    if (user.type == types.BUYER) 
      return true;
    else 
      return false;
  }

  getUsername(): string {
    let us = this.tokenService.getUser().username;
    if (us == null || us == undefined)  return '';
    else return us;
  }
}
