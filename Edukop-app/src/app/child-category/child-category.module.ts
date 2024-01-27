import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ChildViewModule } from '../child-common/child-component.module';

//import { BookSetPage } from '../product-page/product-page';
import { MainPipe } from '../shared/pipes/pipe.module';

import { ChildCategoryPageRoutingModule } from './child-category-routing.module';
import { ChildCategoryPage } from './child-category.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ChildCategoryPageRoutingModule,
        MainPipe,
        ChildViewModule,
    ],
    declarations: [ChildCategoryPage],
    entryComponents: [],
})
export class ChildCategoryPageModule {}
