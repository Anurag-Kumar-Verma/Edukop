import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DownloadByCategoryPageRoutingModule } from './download-by-category-routing.module';

import { DownloadByCategoryPage } from './download-by-category.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        DownloadByCategoryPageRoutingModule,
    ],
    declarations: [DownloadByCategoryPage],
})
export class DownloadByCategoryPageModule {}
