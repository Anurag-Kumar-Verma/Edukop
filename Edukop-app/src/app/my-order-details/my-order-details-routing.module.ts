import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MyOrderDetailsPage } from './my-order-details.page';

const routes: Routes = [
    {
        path: '',
        component: MyOrderDetailsPage,
        data: { oreder: 'some value' },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MyOrderDetailsPageRoutingModule {}
