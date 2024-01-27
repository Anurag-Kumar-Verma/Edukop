import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OfflineDownloadsComponent } from './offline-downloads.component';

const routes: Routes = [
  {
    path: '',
    component: OfflineDownloadsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OfflineDownloadRoutingModule { }
