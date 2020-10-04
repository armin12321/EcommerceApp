import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

import { authInterceptorProviders } from './interceptors/auth.interceptor';
import { ProfileComponent } from './components/profile/profile.component';
import { CartComponent } from './components/cart/cart.component';
import { ModalModule, BsModalRef } from 'ngx-bootstrap/modal';
import { ProductsComponent } from './components/products/products.component';
import { AddproductComponent } from './components/addproduct/addproduct.component';
import { SellerInfoComponent } from './components/seller-info/seller-info.component';
import { ProductInfoComponent } from './components/product-info/product-info.component';
import { ChatComponent } from './components/chat/chat.component';
import { InfoComponent } from './components/info/info.component';
import { UpdateUserComponent } from './components/update-user/update-user.component';
import { UpdateProductComponent } from './components/update-product/update-product.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    CartComponent,
    ProductsComponent,
    AddproductComponent,
    SellerInfoComponent,
    ProductInfoComponent,
    ChatComponent,
    InfoComponent,
    UpdateUserComponent,
    UpdateProductComponent,
  ],
  imports: [
    ModalModule.forRoot(),
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    HttpModule,
    FlashMessagesModule.forRoot(),
  ],
  providers: [authInterceptorProviders, BsModalRef],
  bootstrap: [AppComponent]
})
export class AppModule { }
