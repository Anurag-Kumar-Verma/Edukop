import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SubComponentModule } from '../sub-category-components/sub-component.module';

import { SubCategoryPageRoutingModule } from './sub-categories-routing.module';
import { SubCategoryPage } from './sub-categories.page';
// import { StandardPipe } from "../shared/pipes/standard.pipe";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SubCategoryPageRoutingModule,
        HttpClientModule,
        SubComponentModule,
    ],
    declarations: [SubCategoryPage],
    entryComponents: [],
})
export class SubCategoryPageModule {}
