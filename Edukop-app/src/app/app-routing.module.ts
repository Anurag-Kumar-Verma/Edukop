import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './auth/services/auth-guard.service';
import { DeactiveAuthGuard } from './auth/services/deactive-guard.service';
import { GuestAuthGuard } from './auth/services/guest-auth-guard.service';
import { CouponsComponent } from './coupons/coupons.component';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { FormListComponent } from './form-list/form-list.component';
// import { ReviewComponent } from './review/review.component';

const routes: Routes = [
    { path: '', redirectTo: 'tab', pathMatch: 'full' },
    // {
    //     path: 'login',
    //     loadChildren: () =>
    //         import('./login-container/login.module').then(
    //             m => m.LoginPageModule
    //         ),
    //     canActivate: [DeactiveAuthGuard],
    // },
    // {
    //     path: 'dashboard',
    //     loadChildren: () =>
    //         import('./dashboard/dashboard.module').then(
    //             m => m.DashboardPageModule
    //         ),
    //     canActivate: [AuthGuard],
    // },
    // {
    //   path: "login",
    //   loadChildren: () =>
    //     import("./login/login.module").then((m) => m.LoginPageModule),
    // },
    {
        path: 'signup',
        loadChildren: () =>
            import('./signup-container/signup.module').then(
                m => m.SignupPageModule
            ),
    },
    // {
    //     path: 'sub-categories/:id',
    //     loadChildren: () =>
    //         import('./sub-category/sub-categories.module').then(
    //             m => m.SubCategoryPageModule
    //         ),
    //     canActivate: [AuthGuard],
    // },
    // {
    //     path: 'child-category/:id',
    //     loadChildren: () =>
    //         import('./child-category/child-category.module').then(
    //             m => m.ChildCategoryPageModule
    //         ),
    //     canActivate: [AuthGuard],
    // },
    // {
    //     path: 'child-category/:state',
    //     loadChildren: () =>
    //         import('./child-category/child-category.module').then(
    //             m => m.ChildCategoryPageModule
    //         ),
    //     canActivate: [AuthGuard],
    // },
    // {
    //     path: 'product-page/:id',
    //     loadChildren: () =>
    //         import('./product-page/product-page.module').then(
    //             m => m.ProductPageModule
    //         ),
    //     canActivate: [AuthGuard],
    // },

    // {
    //     path: 'buy-now',
    //     loadChildren: () =>
    //         import('./buy-now/buy-now.module').then(m => m.BuyNowPageModule),
    //     canActivate: [AuthGuard, GuestAuthGuard],
    // },

    // {
    //   path: "buy-now/:addressId",
    //   loadChildren: () =>
    //     import("./buy-now/buy-now.module").then((m) => m.BuyNowPageModule),
    //   canActivate: [AuthGuard],
    // },
    // {
    //     path: 'buy-now/:id',
    //     loadChildren: () =>
    //         import('./buy-now/buy-now.module').then(m => m.BuyNowPageModule),
    //     canActivate: [AuthGuard, GuestAuthGuard],
    // },

    // {
    //     path: 'pay',
    //     loadChildren: () =>
    //         import('./pay/pay.module').then(m => m.PayPageModule),
    //     canActivate: [AuthGuard, GuestAuthGuard],
    // },
    // {
    //     path: 'change-address',
    //     loadChildren: () =>
    //         import('./change-address/change-address.module').then(
    //             m => m.ChangeAddressPageModule
    //         ),
    //     canActivate: [AuthGuard, GuestAuthGuard],
    // },
    // {
    //     path: 'change-address/:id',
    //     loadChildren: () =>
    //         import('./change-address/change-address.module').then(
    //             m => m.ChangeAddressPageModule
    //         ),
    //     canActivate: [AuthGuard, GuestAuthGuard],
    // },
    // {
    //     path: 'user-info/:id',
    //     loadChildren: () =>
    //         import('./user-info/user-info.module').then(
    //             m => m.UserInfoPageModule
    //         ),
    //     canActivate: [AuthGuard, GuestAuthGuard],
    // },
    // {
    //     path: 'add-address/:id',
    //     loadChildren: () =>
    //         import('./add-address/add-address.module').then(
    //             m => m.AddAddressPageModule
    //         ),
    //     canActivate: [AuthGuard, GuestAuthGuard],
    // },
    // {
    //     path: 'my-orders/:id',
    //     loadChildren: () =>
    //         import('./my-orders/my-orders.module').then(
    //             m => m.MyOrdersPageModule
    //         ),
    //     canActivate: [AuthGuard, GuestAuthGuard],
    // },

    // {
    //     path: 'my-account/:id',
    //     loadChildren: () =>
    //         import('./my-account/my-account.module').then(
    //             m => m.MyAccountPageModule
    //         ),
    //     canActivate: [AuthGuard, GuestAuthGuard],
    // },
    // {
    //     path: 'logintabs',
    //     loadChildren: () =>
    //         import('./logintabs/logintabs.module').then(
    //             m => m.LogintabsPageModule
    //         ),
    //     canActivate: [AuthGuard],
    // },
    {
        path: 'tab',
        loadChildren: () =>
            import('./tab/tab.module').then(m => m.TabPageModule),
        canActivate: [AuthGuard],
    },
    {
        path: 'download-by-category',
        loadChildren: () =>
            import('./download-by-category/download-by-category.module').then(
                m => m.DownloadByCategoryPageModule
            ),
    },
    {
        path: 'download-child-category',
        loadChildren: () =>
            import(
                './download-child-category/download-child-category.module'
            ).then(m => m.DownloadChildCategoryPageModule),
    },
    {
        path: 'request-product',
        loadChildren: () =>
            import('./request-product/request-product.module').then(
                m => m.RequestProductPageModule
            ),
    },
  {
    path: 'news-section',
    loadChildren: () => import('./news-section/news-section.module').then( m => m.NewsSectionPageModule)
  },
  {
    path: 'news-comments',
    loadChildren: () => import('./news-comments/news-comments.module').then( m => m.NewsCommentsPageModule)
  },
  {
    path: 'privacy-policy',
    loadChildren: () => import('./privacy-policy/privacy-policy.module').then( m => m.PrivacyPolicyPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
    // {
    //     path: 'cart',
    //     loadChildren: () =>
    //         import('./cart/cart.module').then(m => m.CartPageModule),
    //     canActivate: [AuthGuard],
    // },
    // {
    //     path: 'cart/:id',
    //     loadChildren: () =>
    //         import('./cart/cart.module').then(m => m.CartPageModule),
    //     canActivate: [AuthGuard],
    // },
    // {
    //     path: 'product-list/:id',
    //     loadChildren: () =>
    //         import('./product-list/product-list.module').then(
    //             m => m.ProductListPageModule
    //         ),
    //     canActivate: [AuthGuard],
    // },

    // {
    //     path: 'my-order-details',
    //     loadChildren: () =>
    //         import('./my-order-details/my-order-details.module').then(
    //             m => m.MyOrderDetailsPageModule
    //         ),
    //     canActivate: [AuthGuard, GuestAuthGuard],
    // },

    // {
    //     path: 'my-order-details/:id',
    //     loadChildren: () =>
    //         import('./my-order-details/my-order-details.module').then(
    //             m => m.MyOrderDetailsPageModule
    //         ),
    //     canActivate: [AuthGuard, GuestAuthGuard],
    // },
    // {
    //     path: 'wishlist/:id',
    //     loadChildren: () =>
    //         import('./wishlist/wishlist.module').then(
    //             m => m.WishlistPageModule
    //         ),
    //     canActivate: [AuthGuard, GuestAuthGuard],
    // },
    // {
    //     path: 'order-placed/:id',
    //     loadChildren: () =>
    //         import('./order-placed/order-placed.module').then(
    //             m => m.OrderPlacedPageModule
    //         ),
    //     canActivate: [AuthGuard, GuestAuthGuard],
    // },
    // {
    //     path: 'all-categories/:id',
    //     loadChildren: () =>
    //         import('./all-categories/all-categories.module').then(
    //             m => m.AllCategoriesPageModule
    //         ),
    //     canActivate: [AuthGuard],
    // },

    // {
    //     path: 'dynamic-form/:id',
    //     component: DynamicFormComponent,
    //     canActivate: [AuthGuard],
    // },
    // {
    //     path: 'form-list/:id',
    //     component: FormListComponent,
    //     canActivate: [AuthGuard],
    // },
    // {
    //     path: 'coupons/:id',
    //     component: CouponsComponent,
    //     canActivate: [AuthGuard],
    // },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
