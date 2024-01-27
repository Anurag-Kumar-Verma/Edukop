import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import {
    FileTransfer,
    FileTransferObject,
    FileUploadOptions,
} from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { IonicModule } from '@ionic/angular';

import { MyOrderDetailsPageRoutingModule } from './my-order-details-routing.module';
import { MyOrderDetailsPage } from './my-order-details.page';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        MyOrderDetailsPageRoutingModule,
    ],
    declarations: [MyOrderDetailsPage],
    providers: [File, FileOpener, FileTransfer],
})
export class MyOrderDetailsPageModule {}
