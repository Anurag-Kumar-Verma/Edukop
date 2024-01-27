import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { MaterialModule } from './material.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MyCartComponent } from './my-cart/my-cart.component';
import { AddAaddressComponent } from './forms/add-aaddress/add-aaddress.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoginComponent } from './forms/login/login.component';
import { SignupComponent } from './forms/signup/signup.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { ProductListComponent } from './product-list/product-list.component';
import { BarRatingModule } from "ngx-bar-rating";
import { ProductReviewComponent } from './product-review/product-review.component';
import { ProductReviewFormComponent } from './forms/product-review-form/product-review-form.component';
import { RequestProductComponent } from './forms/request-product/request-product.component';
import { ToastrModule } from 'ngx-toastr';
import { FormInputValidationModule } from './shared/form-input-validation/form-input-validation.module';
import { ScrollableCategorySectionComponent } from './common/scrollable-category-section/scrollable-category-section.component';
import { BannerSectionComponent } from './common/banner-section/banner-section.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { TwoColumnSectionComponent } from './common/two-column-section/two-column-section.component';
import { SingleImageComponent } from './common/single-image/single-image.component';
import { ScrollableSquareSectionComponent } from './common/scrollable-square-section/scrollable-square-section.component';
import { NgxUiLoaderConfig, NgxUiLoaderModule, NgxUiLoaderRouterModule } from 'ngx-ui-loader';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxSpinnerModule } from 'ngx-spinner';
import { PipeModule } from './shared/pipe/pipe.module';
import { CouponComponent } from './order/coupon/coupon.component';
import { BuyNowComponent } from './order/buy-now/buy-now.component';
import { EnrollmentFormComponent } from './forms/enrollments/enrollment-form/enrollment-form.component';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from 'angularx-social-login';
import { TokenInterceptor } from './auth/toke.interceptor';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { TermsOfUseComponent } from './terms-of-use/terms-of-use.component';
import { FaqsComponent } from './shared/faqs/faqs.component';
import { EdukopFrontComponent } from './shared/edukop-front/edukop-front.component';
import { ChangePasswordComponent } from './forms/change-password/change-password.component';
import { ForgotPasswordComponent } from './forms/forgot-password/forgot-password.component';
import { NgxOtpInputModule } from 'ngx-otp-input';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  bgsColor: "#84bd47",
  bgsOpacity: 0.5,
  bgsPosition: "bottom-right",
  bgsSize: 50,
  bgsType: "three-strings",
  blur: 2,
  delay: 0,
  fastFadeOut: true,
  fgsColor: "#84bd47",
  fgsPosition: "center-center",
  fgsSize: 50,
  fgsType: "three-strings",
  gap: 24,
  logoPosition: "center-center",
  logoSize: 120,
  logoUrl: "",
  masterLoaderId: "container",
  overlayBorderRadius: "0",
  overlayColor: "rgba(40, 40, 40, 0.8)",
  pbColor: "#84bd47",
  pbDirection: "ltr",
  pbThickness: 3,
  hasProgressBar: true,
  text: "",
  textColor: "#FFFFFF",
  textPosition: "center-center",
  maxTime: -1,
  minTime: 300,
};
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    DashboardComponent,
    ProductDetailComponent,
    MyCartComponent,
    AddAaddressComponent,
    LoginComponent,
    SignupComponent,
    ProductListComponent,
    ProductReviewComponent,
    ProductReviewFormComponent,
    RequestProductComponent,
    ScrollableCategorySectionComponent,
    BannerSectionComponent,
    TwoColumnSectionComponent,
    SingleImageComponent,
    ScrollableSquareSectionComponent,
    BuyNowComponent,
    CouponComponent,
    EnrollmentFormComponent,
    TermsOfUseComponent,
    FaqsComponent,
    EdukopFrontComponent,
    ForgotPasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    BarRatingModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    FormInputValidationModule,
    HttpClientModule,
    NgxIntlTelInputModule,
    NgxMatSelectSearchModule,
    ToastrModule.forRoot(),
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    NgxUiLoaderRouterModule,
    InfiniteScrollModule,
    NgxSpinnerModule.forRoot(),
    PipeModule,
    SocialLoginModule,
    NgxOtpInputModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    {
      provide: "SocialAuthServiceConfig",
      useValue: {
        authLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              "417760524574-hcikj4idscun7g3u6dki88n23els9qsc.apps.googleusercontent.com"
            ),
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider("5101584633234492"),
          },
        ],
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
