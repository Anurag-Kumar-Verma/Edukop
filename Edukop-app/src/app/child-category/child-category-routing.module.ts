import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ChildCategoryPage } from './child-category.page';

const routes: Routes = [
    {
        path: '',
        component: ChildCategoryPage,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ChildCategoryPageRoutingModule {}
