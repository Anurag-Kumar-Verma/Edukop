import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewsSectionPageRoutingModule } from './news-section-routing.module';

import { NewsSectionPage } from './news-section.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewsSectionPageRoutingModule
  ],
  declarations: [NewsSectionPage]
})
export class NewsSectionPageModule {}
