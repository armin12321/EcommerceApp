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

  getRecentChats(): Observable<any> {
    // throw new Error('Method not implemented.');
    return this.http.get(`${this.serverURL}/api/info/recentChats`);
  }

  findByID(data): Observable<any> {
    // throw new Error('Method not implemented.');
    return this.http.post(`${this.serverURL}/api/user/getByID`, data);
  }
  getMessagesInfo(): Observable<any> {
    // throw new Error('Method not implemented.');
    return this.http.get(`${this.serverURL}/api/info/newMessages`);
  }

  getNotifications() {
    // throw new Error('Method not implemented.');
    return this.http.get(`${this.serverURL}/api/user/notifications`);
  }

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

  getTopProducts(data): Observable<any> {
    return this.http.post(`${this.serverURL}/api/public/topProducts`, data);
  }

  loadOldMessages(data): Observable<any> {
    return this.http.post(`${this.serverURL}/api/user/chat/loadMessages`, data);
  }

  sendMessagee(data): Observable<any> {
    return this.http.post(`${this.serverURL}/api/user/chat/sendMessage`, data);
  }

  getNewMessages(data): Observable<any> {
    return this.http.post(`${this.serverURL}/api/user/chat/getNewMessages`, data);
  }
}
