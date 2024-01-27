import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MyAccountPage } from './my-account.page';

const routes: Routes = [
    {
        path: '',
        component: MyAccountPage,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MyAccountPageRoutingModule {}
