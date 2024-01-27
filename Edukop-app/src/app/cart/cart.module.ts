import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';


import { GProductModalComponent } from '../g-product-modal/g-product-modal.component';

import { CartPageRoutingModule } from './cart-routing.module';
import { CartPage } from './cart.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CartPageRoutingModule,
        ReactiveFormsModule,
    ],
    declarations: [CartPage, GProductModalComponent],
})
export class CartPageModule {}
