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
  breadcrumbs: Array<string> = ["All"];
  breadcrumbs1: Array<string> = [];
  profileUser: any = {};
  product: any = {};

  constructor(
    private sanitizer: DomSanitizer
  ) { }

  setChatPersonAvatarURL(a: string): void {
    this.chat_person_avatarURL = a;
    localStorage.removeItem("avatarURL");

    localStorage.setItem("avatarURL", this.chat_person_avatarURL);        
  }

  initBreadcrumbs(s: string): void {
    this.breadcrumbs.push(s);
  }

  addBreadcrumb(s: string): void {
    if (this.breadcrumbs.indexOf(s) != -1) {
      this.goToBreadcrumb(s);  
    } else {
      this.breadcrumbs.push(s);       
    }
  }

  addBreadcrumb1(s: string): void {
    if (this.breadcrumbs1.indexOf(s) != -1) {
      this.goToBreadcrumb1(s);  
    } else {
      this.breadcrumbs1.push(s);       
    }
  }

  goToBreadcrumb1(breadcrumb: string): void {
    for (let i = this.breadcrumbs1.length - 1; i >= 0; i--) {
      if (this.breadcrumbs1[i] == breadcrumb) break;
      this.breadcrumbs1.pop();
    }
  }

  goToBreadcrumb(breadcrumb: string): void {
    for (let i = this.breadcrumbs.length - 1; i >= 1; i--) {
      if (this.breadcrumbs[i] == breadcrumb) break;
      this.breadcrumbs.pop();
    }
  }


  deleteBreadcrumb1(): void {
    if (this.breadcrumbs1.length > 1)
      this.breadcrumbs1.pop();
  }

  deleteBreadcrumb(): void {
    if (this.breadcrumbs.length > 1)
      this.breadcrumbs.pop();
  }

  clearBreadcrumbs(): void {    
    this.breadcrumbs = ["All"];
  }

  clearBreadcrumbs1(): void {    
    this.breadcrumbs1 = [];
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

  setProfileUser(user: any): void {
    this.profileUser = user;
    localStorage.removeItem("profileUser");
    localStorage.setItem("profileUser", JSON.stringify(this.profileUser));
  }
  
  getProfileUser(): any {
    this.profileUser = JSON.parse(localStorage.getItem('profileUser'));
    return this.profileUser;
  }

  setProduct(product: any): void {
    this.product = product;
    localStorage.removeItem("product");
    localStorage.setItem("product", JSON.stringify(this.product));
  }

  getProduct(): any {
    this.product = JSON.parse(localStorage.getItem("product"));
    return this.product;
  }
}
