import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CommonViewModule } from '../common/common-view.module';
import { FilterModalComponent } from '../filter-modal/filter-modal.component';

import { ProductListPageRoutingModule } from './product-list-routing.module';
import { ProductListPage } from './product-list.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ProductListPageRoutingModule,
        CommonViewModule,
    ],
    declarations: [ProductListPage, FilterModalComponent],
})
export class ProductListPageModule {}
