import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DownloadChildCategoryPage } from './download-child-category.page';

const routes: Routes = [
    {
        path: '',
        component: DownloadChildCategoryPage,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DownloadChildCategoryPageRoutingModule {}
