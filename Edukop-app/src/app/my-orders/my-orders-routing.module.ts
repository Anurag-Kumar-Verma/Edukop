import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MyOrdersPage } from './my-orders.page';

const routes: Routes = [
    {
        path: '',
        component: MyOrdersPage,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MyOrdersPageRoutingModule {}
