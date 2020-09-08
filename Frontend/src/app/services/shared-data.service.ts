import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  seller_id: string = "";
  product_id: string = "";
  constructor() { }

  setProductID(product_id): void {
    this.product_id = product_id;
  }

  setSellerID(seller_id): void {
    this.seller_id = seller_id;
  }

  getSellerID(): string {
    return this.seller_id;
  }

  getProductID(): string {
    return this.product_id;
  }
}
