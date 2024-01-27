import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddAaddressComponent } from './forms/add-aaddress/add-aaddress.component';
import { LoginComponent } from './forms/login/login.component';
import { SignupComponent } from './forms/signup/signup.component';
import { MyCartComponent } from './my-cart/my-cart.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductReviewComponent } from './product-review/product-review.component';
import { ProductReviewFormComponent } from './forms/product-review-form/product-review-form.component';
import { AuthGuard } from './auth/auth-gaurd.service';
import { GuestAuthGuard } from './auth/guest-auth-gaurd.service';
import { BuyNowComponent } from './order/buy-now/buy-now.component';
import { EnrollmentFormComponent } from './forms/enrollments/enrollment-form/enrollment-form.component';
import { TermsOfUseComponent } from './terms-of-use/terms-of-use.component';
import { FaqsComponent } from './shared/faqs/faqs.component';
import { EdukopFrontComponent } from './shared/edukop-front/edukop-front.component';
import { ChangePasswordComponent } from './forms/change-password/change-password.component';
import { ForgotPasswordComponent } from './forms/forgot-password/forgot-password.component';

const routes: Routes = [
  {
    path: 'side',
    title: 'Edukop Web',
    loadChildren: () => import("./container/container.module").then(m => m.ContainerModule),
    canActivate: [AuthGuard]
  },
  {
    path: "dashboard",
    title: 'Dashboard | Edukop',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "",
    redirectTo: '/edukop',
    pathMatch: 'full'
  },
  
  {
    path: "login",
    title: 'Login | Edukop',
    component: LoginComponent
  },
  {
    path: "signup",
    title: 'Sign Up | Edukop',
    component: SignupComponent
  },
  {
    path:'product-detail/:id', component:ProductDetailComponent,
    title: 'Product Detail',
    canActivate: [AuthGuard]
  },
  {
    path:'product-list/:id', component:ProductListComponent,
    title: 'Product List',
    canActivate: [AuthGuard]
  },
  {
    path:'my-cart', component: MyCartComponent,
    title: 'My Cart',
    canActivate: [AuthGuard]
  },
  {
    path:'buy-now', component: BuyNowComponent,
    title: 'Buy Now',
    canActivate: [AuthGuard, GuestAuthGuard]
  },
  {
    path:'add-address', component: AddAaddressComponent,
    title: 'Address',
    canActivate: [AuthGuard, GuestAuthGuard]
  },
  {
    path:'product-review', component:ProductReviewComponent,
    title: 'Reviews',
    canActivate: [AuthGuard]
  },
  {
    path:'product-review-form', component:ProductReviewFormComponent,
    canActivate: [AuthGuard, GuestAuthGuard]
  },
  {
    path:'enrollment-form/:id', component: EnrollmentFormComponent,
    title: 'Enrollment Form',
    canActivate: [AuthGuard]
  },
  {
    path:'terms-of-use', component: TermsOfUseComponent,
    title: 'Terms of use'
  },
  {
    path:'faqs/:id', component: FaqsComponent,
    title: 'FAQs'
  },
  {
    path:'edukop', component: EdukopFrontComponent,
    title: 'Edukop'
  },
  {
    path:'forgot-password', component: ForgotPasswordComponent,
    title: 'Forgot Password'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
