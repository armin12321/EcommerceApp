import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseType } from '@angular/http';

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

  postProductData(data): Observable<any> {
    return this.http.post(`${this.serverURL}/api/product/add`, data);
  }

  postLoginData(data): Observable<any> {    
    return this.http.post(`${this.serverURL}/api/user/login`, data);
  }

  getProductPicture(data): Observable<any> {      
    return this.http.post(`${this.serverURL}/api/product/productImage`, data, {responseType: "blob"});
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

  getSellerData(data): Observable<any> {
    return this.http.post(`${this.serverURL}/api/public/sellerInfo`, data);
  }

  getProductData(data): Observable<any> {
    return this.http.post(`${this.serverURL}/api/public/productInfo`, data);
  } 

  getAvatarImage(data): Observable<any> {
    return this.http.post(`${this.serverURL}/api/public/avatarImage`, data, {responseType: "blob"});
  }
}
