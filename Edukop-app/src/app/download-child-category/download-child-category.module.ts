import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DownloadChildCategoryPageRoutingModule } from './download-child-category-routing.module';

import { DownloadChildCategoryPage } from './download-child-category.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        DownloadChildCategoryPageRoutingModule,
    ],
    declarations: [DownloadChildCategoryPage],
})
export class DownloadChildCategoryPageModule {}
