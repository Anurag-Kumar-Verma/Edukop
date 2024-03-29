import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AddAddressPage } from './add-address.page';

const routes: Routes = [
    {
        path: '',
        component: AddAddressPage,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AddAddressPageRoutingModule {}
