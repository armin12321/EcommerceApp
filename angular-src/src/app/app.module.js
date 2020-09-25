"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
var platform_browser_1 = require("@angular/platform-browser");
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var forms_1 = require("@angular/forms");
var angular2_flash_messages_1 = require("angular2-flash-messages");
var http_2 = require("@angular/http");
var app_routing_module_1 = require("./app-routing.module");
var app_component_1 = require("./app.component");
var navbar_component_1 = require("./components/navbar/navbar.component");
var home_component_1 = require("./components/home/home.component");
var login_component_1 = require("./components/login/login.component");
var register_component_1 = require("./components/register/register.component");
var auth_interceptor_1 = require("./interceptors/auth.interceptor");
var profile_component_1 = require("./components/profile/profile.component");
var cart_component_1 = require("./components/cart/cart.component");
var modal_1 = require("ngx-bootstrap/modal");
var products_component_1 = require("./components/products/products.component");
var addproduct_component_1 = require("./components/addproduct/addproduct.component");
var seller_info_component_1 = require("./components/seller-info/seller-info.component");
var product_info_component_1 = require("./components/product-info/product-info.component");
var chat_component_1 = require("./components/chat/chat.component");
var info_component_1 = require("./components/info/info.component");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                app_component_1.AppComponent,
                navbar_component_1.NavbarComponent,
                home_component_1.HomeComponent,
                login_component_1.LoginComponent,
                register_component_1.RegisterComponent,
                profile_component_1.ProfileComponent,
                cart_component_1.CartComponent,
                products_component_1.ProductsComponent,
                addproduct_component_1.AddproductComponent,
                seller_info_component_1.SellerInfoComponent,
                product_info_component_1.ProductInfoComponent,
                chat_component_1.ChatComponent,
                info_component_1.InfoComponent,
            ],
            imports: [
                modal_1.ModalModule.forRoot(),
                platform_browser_1.BrowserModule,
                app_routing_module_1.AppRoutingModule,
                http_1.HttpClientModule,
                forms_1.FormsModule,
                http_2.HttpModule,
                angular2_flash_messages_1.FlashMessagesModule.forRoot(),
            ],
            providers: [auth_interceptor_1.authInterceptorProviders, modal_1.BsModalRef],
            bootstrap: [app_component_1.AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
