import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
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

const routes: Routes = [
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

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })], //da mogu ponovo ucitane komponente imat lifecycle hookove.
  exports: [RouterModule]
})
export class AppRoutingModule { }
