var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { CartComponent } from './components/cart/cart.component';
import { ProductsComponent } from './components/products/products.component';
import { AddproductComponent } from './components/addproduct/addproduct.component';
import { SellerInfoComponent } from './components/seller-info/seller-info.component';
import { ProductInfoComponent } from './components/product-info/product-info.component';
import { ChatComponent } from './components/chat/chat.component';
import { InfoComponent } from './components/info/info.component';
const routes = [
    {
        path: 'public/home',
        component: HomeComponent
    },
    {
        path: 'user/login',
        component: LoginComponent
    },
    {
        path: 'user/register',
        component: RegisterComponent
    },
    {
        path: '',
        redirectTo: 'public/home',
        pathMatch: 'full'
    },
    {
        path: 'user/profile',
        component: ProfileComponent
    },
    {
        path: 'user/cart',
        component: CartComponent
    },
    {
        path: 'user/products',
        component: ProductsComponent
    },
    {
        path: 'products/add',
        component: AddproductComponent
    },
    {
        path: 'public/sellerInfo',
        component: SellerInfoComponent
    },
    {
        path: 'public/productInfo',
        component: ProductInfoComponent
    },
    {
        path: 'user/chat',
        component: ChatComponent
    },
    {
        path: 'user/info',
        component: InfoComponent
    }
];
let AppRoutingModule = class AppRoutingModule {
};
AppRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
        exports: [RouterModule]
    })
], AppRoutingModule);
export { AppRoutingModule };
