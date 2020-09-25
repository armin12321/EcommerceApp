"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppRoutingModule = void 0;
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var home_component_1 = require("./components/home/home.component");
var login_component_1 = require("./components/login/login.component");
var register_component_1 = require("./components/register/register.component");
var profile_component_1 = require("./components/profile/profile.component");
var cart_component_1 = require("./components/cart/cart.component");
var products_component_1 = require("./components/products/products.component");
var addproduct_component_1 = require("./components/addproduct/addproduct.component");
var seller_info_component_1 = require("./components/seller-info/seller-info.component");
var product_info_component_1 = require("./components/product-info/product-info.component");
var chat_component_1 = require("./components/chat/chat.component");
var info_component_1 = require("./components/info/info.component");
var routes = [
    {
        path: 'public/home',
        component: home_component_1.HomeComponent
    },
    {
        path: 'user/login',
        component: login_component_1.LoginComponent
    },
    {
        path: 'user/register',
        component: register_component_1.RegisterComponent
    },
    {
        path: '',
        redirectTo: 'public/home',
        pathMatch: 'full'
    },
    {
        path: 'user/profile',
        component: profile_component_1.ProfileComponent
    },
    {
        path: 'user/cart',
        component: cart_component_1.CartComponent
    },
    {
        path: 'user/products',
        component: products_component_1.ProductsComponent
    },
    {
        path: 'products/add',
        component: addproduct_component_1.AddproductComponent
    },
    {
        path: 'public/sellerInfo',
        component: seller_info_component_1.SellerInfoComponent
    },
    {
        path: 'public/productInfo',
        component: product_info_component_1.ProductInfoComponent
    },
    {
        path: 'user/chat',
        component: chat_component_1.ChatComponent
    },
    {
        path: 'user/info',
        component: info_component_1.InfoComponent
    }
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = __decorate([
        core_1.NgModule({
            imports: [router_1.RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
            exports: [router_1.RouterModule]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());
exports.AppRoutingModule = AppRoutingModule;
