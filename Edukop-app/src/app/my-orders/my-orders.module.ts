import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IonicRatingModule } from 'ionic4-rating';
import { MyOrdersPageRoutingModule } from './my-orders-routing.module';
import { MyOrdersPage } from './my-orders.page';

@NgModule({
    imports: [
        IonicRatingModule,
        CommonModule,
        FormsModule,
        IonicModule,
        MyOrdersPageRoutingModule,
    ],
    declarations: [MyOrdersPage],
})
export class MyOrdersPageModule {}
