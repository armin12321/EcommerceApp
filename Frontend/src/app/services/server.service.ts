import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ServerService {
  private serverURL: string = 'http://localhost:5000';

  constructor(
    private http: HttpClient
  ) { }

  getHomeData(): Observable<any> {
    return this.http.get(`${this.serverURL}/api/public/home`, {}); //here goes http options.
  }

  postRegisterData(data): Observable<any> {    
    return this.http.post(`${this.serverURL}/api/user/register`, data);
  }

  postLoginData(data): Observable<any> {    
    return this.http.post(`${this.serverURL}/api/user/login`, data);
  }

  getProfileData(): Observable<any> {
    return this.http.get(`${this.serverURL}/api/user/profile`);
  }

  getCartData(): Observable<any> {
    return this.http.get(`${this.serverURL}/api/user/cart`);
  }

  getMyProducts(): Observable<any> {
    return this.http.get(`${this.serverURL}/api/user/products`);
  }
}
