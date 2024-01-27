import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewsCommentsPageRoutingModule } from './news-comments-routing.module';

import { NewsCommentsPage } from './news-comments.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewsCommentsPageRoutingModule
  ],
  declarations: [NewsCommentsPage]
})
export class NewsCommentsPageModule {}
