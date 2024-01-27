import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContainerRouting } from './container.routing';
import { MaterialModule } from '../material.module';
import { BarRatingModule } from 'ngx-bar-rating';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { ContainerComponent } from './container.component';
import { WishlistComponent } from '../wishlist/wishlist.component';
import { MyAccountComponent } from '../my-account/my-account.component';
import { EditAccountComponent } from '../forms/edit-account/edit-account.component';
import { OrderDetailComponent } from '../order/order-detail/order-detail.component';
import { MyOrdersComponent } from '../order/my-orders/my-orders.component';
import { NewsfeedsComponent } from '../newsfeeds/newsfeeds.component';
import { ToastrModule } from 'ngx-toastr';
import { SupportComponent} from '../support/support.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ChildCategoryComponent } from '../child-category/child-category.component';
import { CategoriesComponent } from '../categories/categories.component';
import { ExamchildViewComponent } from '../childCommon/examchild-view/examchild-view.component';
import { PipeModule } from '../shared/pipe/pipe.module';
import { SubCategoryComponent } from '../sub-category/sub-category.component';
import { FormInputValidationModule } from '../shared/form-input-validation/form-input-validation.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { FomlistComponent } from '../forms/enrollments/fomlist/fomlist.component';
import { DeleteAlertComponent } from '../forms/enrollments/enrollment-form/delete-alert/delete-alert.component';
import { AuthGuard } from '../auth/auth-gaurd.service';
import { OrderCancelationComponent } from '../order/order-cancelation/order-cancelation.component';
import { OrderStatusComponent } from '../order/order-status/order-status.component';
import { DownloadByCategoryComponent } from '../categories/download-by-category/download-by-category.component';
import { ChangePasswordComponent } from '../forms/change-password/change-password.component';



@NgModule({
  declarations: [
    ContainerComponent,
    WishlistComponent,
    MyAccountComponent,
    EditAccountComponent,
    MyOrdersComponent,
    OrderDetailComponent,
    NewsfeedsComponent,
    SupportComponent,
    CategoriesComponent,
    ChildCategoryComponent,
    ExamchildViewComponent,
    SubCategoryComponent,
    FomlistComponent,
    DeleteAlertComponent,
    OrderCancelationComponent,
    OrderStatusComponent,
    DownloadByCategoryComponent,
    ChangePasswordComponent,
  ],
  imports: [
    CommonModule,
    ContainerRouting,
    MaterialModule,
    BarRatingModule,
    MatTooltipModule,
    FormsModule,
    MDBBootstrapModule.forRoot(),
    ReactiveFormsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    NgxSpinnerModule.forRoot(),
    NgxMatSelectSearchModule,
    NgxIntlTelInputModule,
    PipeModule,
    InfiniteScrollModule,
    FormInputValidationModule,
  ],
  providers: [AuthGuard],
})
export class ContainerModule {}
