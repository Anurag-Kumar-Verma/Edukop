import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewsSectionPage } from './news-section.page';

const routes: Routes = [
  {
    path: '',
    component: NewsSectionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewsSectionPageRoutingModule {}
