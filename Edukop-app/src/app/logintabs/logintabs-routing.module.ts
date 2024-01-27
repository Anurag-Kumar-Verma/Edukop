import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LogintabsPage } from './logintabs.page';

const routes: Routes = [
    {
        path: '',
        component: LogintabsPage,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class LogintabsPageRoutingModule {}
