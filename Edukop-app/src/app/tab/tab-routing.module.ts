import { NgModule } from '@angular/core';
import { NavigationEnd, RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../auth/services/auth-guard.service';
import { DeactiveAuthGuard } from '../auth/services/deactive-guard.service';
import { GuestAuthGuard } from '../auth/services/guest-auth-guard.service';
import { CouponsComponent } from '../coupons/coupons.component';
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';
import { FormListComponent } from '../form-list/form-list.component';
import { PdfViewerComponent } from '../shared/components/pdf-viewer/pdf-viewer.component';

import { TabPage } from './tab.page';

const routes: Routes = [
  {
    path: "",
    redirectTo: "/tab/dashboard",
    pathMatch: "full",
  },
  {
    path: "",
    component: TabPage,
    children: [
      {
        path: "dashboard",
        loadChildren: () =>
          import("../dashboard/dashboard.module").then(
            (m) => m.DashboardPageModule
          ),
      },
      {
        path: "terms-of-use",
        loadChildren: () =>
          import("../terms-of-use/terms-of-use.module").then(
            (m) => m.TermsOfUseModule
          ),
      },
      {
        path: "privacy-policy",
        loadChildren: () =>
          import("../privacy-policy/privacy-policy.module").then(
            (m) => m.PrivacyPolicyPageModule
          ),
      },
      {
        path: "login",
        loadChildren: () =>
          import("../login-container/login.module").then(
            (m) => m.LoginPageModule
          ),
        canActivate: [DeactiveAuthGuard],
      },
      {
        path: "my-orders",
        loadChildren: () =>
          import("../my-orders/my-orders.module").then(
            (m) => m.MyOrdersPageModule
          ),
        canActivate: [AuthGuard, GuestAuthGuard],
      },
      {
        path: "support",
        loadChildren: () =>
          import("../support/support.module").then((m) => m.SupportModule),
        canActivate: [AuthGuard],
      },
      {
        path: "news-section/:id",
        loadChildren: () =>
          import("../news-section/news-section.module").then(
            (m) => m.NewsSectionPageModule
          ),
        canActivate: [AuthGuard, GuestAuthGuard],
      },
      {
        path: "news-comments/:id",
        loadChildren: () =>
          import("../news-comments/news-comments.module").then(
            (m) => m.NewsCommentsPageModule
          ),
        canActivate: [AuthGuard, GuestAuthGuard],
      },
      {
        path: "my-account",
        loadChildren: () =>
          import("../my-account/my-account.module").then(
            (m) => m.MyAccountPageModule
          ),
        canActivate: [AuthGuard, GuestAuthGuard],
      },
      {
        path: "all-categories",
        loadChildren: () =>
          import("../all-categories/all-categories.module").then(
            (m) => m.AllCategoriesPageModule
          ),
      },
      {
        path: "sub-categories/:id",
        loadChildren: () =>
          import("../sub-category/sub-categories.module").then(
            (m) => m.SubCategoryPageModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: "child-category/:id",
        loadChildren: () =>
          import("../child-category/child-category.module").then(
            (m) => m.ChildCategoryPageModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: "child-category/:state",
        loadChildren: () =>
          import("../child-category/child-category.module").then(
            (m) => m.ChildCategoryPageModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: "product-page/:id",
        loadChildren: () =>
          import("../product-page/product-page.module").then(
            (m) => m.ProductPageModule
          ),
        canActivate: [AuthGuard],
      },
      // {
      //     path: 'buy-now',
      //     loadChildren: () =>
      //         import('../buy-now/buy-now.module').then(m => m.BuyNowPageModule),
      //     canActivate: [AuthGuard, GuestAuthGuard],
      // },
      {
        path: "buy-now/:id",
        loadChildren: () =>
          import("../buy-now/buy-now.module").then((m) => m.BuyNowPageModule),
        canActivate: [AuthGuard, GuestAuthGuard],
      },
      {
        path: "change-address",
        loadChildren: () =>
          import("../change-address/change-address.module").then(
            (m) => m.ChangeAddressPageModule
          ),
        canActivate: [AuthGuard, GuestAuthGuard],
      },
      {
        path: "change-address/:id",
        loadChildren: () =>
          import("../change-address/change-address.module").then(
            (m) => m.ChangeAddressPageModule
          ),
        canActivate: [AuthGuard, GuestAuthGuard],
      },
      {
        path: "user-info/:id",
        loadChildren: () =>
          import("../user-info/user-info.module").then(
            (m) => m.UserInfoPageModule
          ),
        canActivate: [AuthGuard, GuestAuthGuard],
      },
      {
        path: "add-address/:id",
        loadChildren: () =>
          import("../add-address/add-address.module").then(
            (m) => m.AddAddressPageModule
          ),
        canActivate: [AuthGuard, GuestAuthGuard],
      },
      {
        path: "cart/:id",
        loadChildren: () =>
          import("../cart/cart.module").then((m) => m.CartPageModule),
        canActivate: [AuthGuard],
      },
      {
        path: "product-list/:id",
        loadChildren: () =>
          import("../product-list/product-list.module").then(
            (m) => m.ProductListPageModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: "my-order-details/:id",
        loadChildren: () =>
          import("../my-order-details/my-order-details.module").then(
            (m) => m.MyOrderDetailsPageModule
          ),
        canActivate: [AuthGuard, GuestAuthGuard],
      },
      {
        path: "wishlist/:id",
        loadChildren: () =>
          import("../wishlist/wishlist.module").then(
            (m) => m.WishlistPageModule
          ),
        canActivate: [AuthGuard, GuestAuthGuard],
      },
      {
        path: "order-placed/:id",
        loadChildren: () =>
          import("../order-placed/order-placed.module").then(
            (m) => m.OrderPlacedPageModule
          ),
        canActivate: [AuthGuard, GuestAuthGuard],
      },
      {
        path: "download-by-category/:id",
        loadChildren: () =>
          import("../download-by-category/download-by-category.module").then(
            (m) => m.DownloadByCategoryPageModule
          ),
        // canActivate: [AuthGuard, GuestAuthGuard],
      },
      {
        path: "download-child-category/:id",
        loadChildren: () =>
          import(
            "../download-child-category/download-child-category.module"
          ).then((m) => m.DownloadChildCategoryPageModule),
        // canActivate: [AuthGuard, GuestAuthGuard],
      },
      {
        path: "pdf-previewer/:id",
        loadChildren: () =>
          import("../shared/components/pdf-viewer/pdf-viewer.module").then(
            (m) => m.PDFViewerModule
          ),
        canActivate: [AuthGuard, GuestAuthGuard],
      },
      {
        path: "downloaded/:id",
        loadChildren: () =>
          import("../offline-downloads/offline-downloads.module").then(
            (m) => m.OfflineDownloadsModule
          ),
        canActivate: [AuthGuard, GuestAuthGuard],
      },
      {
        path: "review/:id",
        loadChildren: () =>
          import("../review/review.module").then((m) => m.ReviewPageModule),
        canActivate: [AuthGuard, GuestAuthGuard],
      },
      {
        path: "request-product/:id",
        loadChildren: () =>
          import("../request-product/request-product.module").then(
            (m) => m.RequestProductPageModule
          ),
        canActivate: [AuthGuard, GuestAuthGuard],
      },
      {
        path: "faq/:id",
        loadChildren: () =>
          import("../faq/faq.module").then((m) => m.FAQPageModule),
        // canActivate: [AuthGuard, GuestAuthGuard],
      },
      {
        path: "dynamic-form/:id",
        component: DynamicFormComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "form-list/:id",
        component: FormListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "coupons/:id",
        component: CouponsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "coupons/:id",
        component: CouponsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "change-password",
        loadChildren: () =>
          import("./../change-password/change-password.module").then(
            (m) => m.ChangePasswordPageModule
          ),
      },
    ],
    canActivate: [AuthGuard],
  },
  // {
  //     path: '',
  //     component: TabPage,
  //     children: [
  //         {
  //             path: 'dashboard',
  //             loadChildren: () =>
  //                 import('../dashboard/dashboard.module').then(
  //                     m => m.DashboardPageModule
  //                 ),
  //         },
  //         {
  //             path: 'my-orders',
  //             loadChildren: () =>
  //                 import('../my-orders/my-orders.module').then(
  //                     m => m.MyOrdersPageModule
  //                 ),
  //             canActivate: [AuthGuard, GuestAuthGuard],
  //         },
  //         {
  //             path: 'my-account',
  //             loadChildren: () =>
  //                 import('../my-account/my-account.module').then(
  //                     m => m.MyAccountPageModule
  //                 ),
  //             canActivate: [AuthGuard, GuestAuthGuard],
  //         },
  //         {
  //             path: 'all-categories',
  //             loadChildren: () =>
  //                 import('../all-categories/all-categories.module').then(
  //                     m => m.AllCategoriesPageModule
  //                 ),
  //         },
  //     ],
  //     canActivate: [AuthGuard],
  // },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TabPageRoutingModule {}
