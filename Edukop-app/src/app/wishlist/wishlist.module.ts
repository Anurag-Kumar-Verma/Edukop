import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { WishlistPageRoutingModule } from './wishlist-routing.module';
import { WishlistPage } from './wishlist.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        WishlistPageRoutingModule,
    ],
    declarations: [WishlistPage],
})
export class WishlistPageModule {}
