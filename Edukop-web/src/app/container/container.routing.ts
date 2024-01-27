import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth-gaurd.service';
import { GuestAuthGuard } from '../auth/guest-auth-gaurd.service';
import { CategoriesComponent } from '../categories/categories.component';
import { DownloadByCategoryComponent } from '../categories/download-by-category/download-by-category.component';
import { ChildCategoryComponent } from '../child-category/child-category.component';
import { AddAaddressComponent } from '../forms/add-aaddress/add-aaddress.component';
import { ChangePasswordComponent } from '../forms/change-password/change-password.component';
import { EditAccountComponent } from '../forms/edit-account/edit-account.component';
import { FomlistComponent } from '../forms/enrollments/fomlist/fomlist.component';
import { MyAccountComponent } from '../my-account/my-account.component';
import { NewsfeedsComponent } from '../newsfeeds/newsfeeds.component';
import { MyOrdersComponent } from '../order/my-orders/my-orders.component';
import { OrderDetailComponent } from '../order/order-detail/order-detail.component';
import { OrderStatusComponent } from '../order/order-status/order-status.component';
import { SubCategoryComponent } from '../sub-category/sub-category.component';
import { SupportComponent } from '../support/support.component';
import { WishlistComponent } from '../wishlist/wishlist.component';
import { ContainerComponent } from './container.component';

const ContainerRoute: Routes = [
  {
    path: "",
    component: ContainerComponent,
    children: [
      {
        path: "my-account",
        title: "My Account",
        component: MyAccountComponent,
        canActivate: [AuthGuard, GuestAuthGuard],
      },
      {
        path: "edit-account",
        title: "Edit Account",
        component: EditAccountComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "wishlist",
        title: "Wishlist",
        component: WishlistComponent,
        canActivate: [AuthGuard, GuestAuthGuard],
      },
      {
        path: "add-address",
        title: "Address",
        component: AddAaddressComponent,
        canActivate: [AuthGuard, GuestAuthGuard],
      },
      {
        path: "my-orders",
        title: "Orders",
        component: MyOrdersComponent,
        canActivate: [AuthGuard, GuestAuthGuard],
      },
      {
        path: "order-detail",
        title: "Order Details",
        component: OrderDetailComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "order-status/:id",
        title: "Order Placed",
        component: OrderStatusComponent,
        canActivate: [AuthGuard, GuestAuthGuard],
      },
      {
        path: "newsfeeds",
        title: "News Feed | Edukop",
        component: NewsfeedsComponent,
        canActivate: [AuthGuard, GuestAuthGuard],
      },
      {
        path: "support",
        title: "Support | Edukop",
        component: SupportComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "categories",
        title: "All Categories",
        component: CategoriesComponent,
      },
      {
        path: "categories/:id",
        title: "Categories",
        component: CategoriesComponent,
      },
      {
        path: "download-by-category/:id",
        title: "Download",
        component: DownloadByCategoryComponent,
      },
      {
        path: "sub-categories",
        title: "Sub Categories",
        component: SubCategoryComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "child-categories/:id",
        title: "Child Categories",
        component: ChildCategoryComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "form-list",
        title: "Enrollments List",
        component: FomlistComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "change-password",
        component: ChangePasswordComponent,
        title: "Change Password",
        canActivate: [AuthGuard],
      },
    ],
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(ContainerRoute)],
  exports: [RouterModule]
})
export class ContainerRouting { }
