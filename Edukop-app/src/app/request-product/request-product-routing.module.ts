import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RequestProductPage } from './request-product.page';

const routes: Routes = [
    {
        path: '',
        component: RequestProductPage,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class RequestProductPageRoutingModule {}
