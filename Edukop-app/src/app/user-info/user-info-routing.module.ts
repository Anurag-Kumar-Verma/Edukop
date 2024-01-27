import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
    FileTransfer,
    FileTransferObject,
} from '@ionic-native/file-transfer/ngx';
import { UserInfoPage } from './user-info.page';

const routes: Routes = [
    {
        path: '',
        component: UserInfoPage,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [FileTransfer, FileTransferObject],
})
export class UserInfoPageRoutingModule {}
