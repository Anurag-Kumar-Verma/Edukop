import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BuyNowPageRoutingModule } from './buy-now-routing.module';
import { BuyNowPage } from './buy-now.page';

@NgModule({
    imports: [CommonModule, FormsModule, IonicModule, BuyNowPageRoutingModule],
    declarations: [BuyNowPage],
})
export class BuyNowPageModule {}
