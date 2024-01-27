import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';

import { CommonViewModule } from '../common/common-view.module';

@NgModule({
    imports: [CommonModule, CommonViewModule, IonicModule, BrowserModule],
    declarations: [],
})
export class GroupProductViewModule {}
