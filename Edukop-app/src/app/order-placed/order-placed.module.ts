import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { OrderPlacedPageRoutingModule } from './order-placed-routing.module';
import { OrderPlacedPage } from './order-placed.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        OrderPlacedPageRoutingModule,
    ],
    declarations: [OrderPlacedPage],
})
export class OrderPlacedPageModule {}
