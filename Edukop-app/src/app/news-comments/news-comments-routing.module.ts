import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewsCommentsPage } from './news-comments.page';

const routes: Routes = [
  {
    path: '',
    component: NewsCommentsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewsCommentsPageRoutingModule {}
