import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    FileTransfer,
    FileUploadOptions,
    FileTransferObject,
} from '@ionic-native/file-transfer/ngx';
import { IonicModule } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { RequestProductPageRoutingModule } from './request-product-routing.module';

import { RequestProductPage } from './request-product.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RequestProductPageRoutingModule,
    ],
    declarations: [RequestProductPage],
    providers: [Camera, File, FileTransfer],
})
export class RequestProductPageModule {}
