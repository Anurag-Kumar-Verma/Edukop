import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { MainPipe } from '../shared/pipes/pipe.module';

import { AllCategoriesPageRoutingModule } from './all-categories-routing.module';
import { AllCategoriesPage } from './all-categories.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        AllCategoriesPageRoutingModule,
        MainPipe,
    ],
    declarations: [AllCategoriesPage],
})
export class AllCategoriesPageModule {}
