import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

const TOKEN_ID: string = 'id_token';
const USER_ID: string = 'user';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  token: string;
  user: any;
  constructor() { }

  storeUserData(token, user): void {
    this.token = token;
    this.user = user;

    localStorage.setItem(TOKEN_ID, this.token);
    localStorage.setItem(USER_ID, JSON.stringify(this.user));
  }

  loadToken() {
    const token = localStorage.getItem(TOKEN_ID);
    this.token = token;
  }

  loadUser() {
    const user = localStorage.getItem(USER_ID);
    this.user = JSON.parse(user);
  }

  getToken(): string {
    this.loadToken();
    return this.token;
  }

  loggedIn(): boolean{
    const helper = new JwtHelperService();
    return helper.isTokenExpired(this.getToken());
  }

}
