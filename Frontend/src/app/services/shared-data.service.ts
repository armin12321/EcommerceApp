import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  seller_id: string = "";
  product_id: string = "";
  chat_person_id: string = "";
  chat_person_username: string = "";
  chat_person_avatarURL: string = "";

  constructor(
    private sanitizer: DomSanitizer
  ) { }

  setChatPersonAvatarURL(a: string): void {
    this.chat_person_avatarURL = a;
    localStorage.removeItem("avatarURL");
    localStorage.setItem("avatarURL", this.chat_person_avatarURL);
  }

  getChatPersonAvatarURL():string {
    this.chat_person_avatarURL = localStorage.getItem("avatarURL");
    return this.chat_person_avatarURL;
  }

  setProductID(product_id): void {
    this.product_id = product_id;
    localStorage.removeItem("productID");
    localStorage.setItem("productID", this.product_id);
  }

  setSellerID(seller_id): void {
    this.seller_id = seller_id;
    localStorage.removeItem("sellerID");
    localStorage.setItem("sellerID", this.seller_id);
  }

  getSellerID(): string {
    this.seller_id = localStorage.getItem("sellerID");
    return this.seller_id;
  }

  getProductID(): string {
    this.product_id = localStorage.getItem("productID");
    return this.product_id;
  }

  showPicture(image: any): any {
    let reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = (_event) => {      
      return this.sanitizer.bypassSecurityTrustUrl(`${reader.result}`);
    };
  }

  setChatPersonID(chat_id: string): void {
    this.chat_person_id = chat_id;
    localStorage.removeItem("chatPersonID");
    localStorage.setItem("chatPersonID", this.chat_person_id);
  }

  getChatPersonID(): string {
    this.chat_person_id = localStorage.getItem("chatPersonID");
    return this.chat_person_id;
  }

  getChatPersonUsername(): string {
    this.chat_person_username = localStorage.getItem("chatPersonUsername");
    return this.chat_person_username;
  }

  setChatPersonUsername(i: string): void {
    this.chat_person_username = i;
    localStorage.removeItem("chatPersonUsername");
    localStorage.setItem("chatPersonUsername", this.chat_person_username);
  }
}
