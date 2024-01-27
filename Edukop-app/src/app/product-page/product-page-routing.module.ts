import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BookSetPage } from './product-page';

const routes: Routes = [
    {
        path: '',
        component: BookSetPage,
        data: { product: 'some value' },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class BookSetPageRoutingModule {}
