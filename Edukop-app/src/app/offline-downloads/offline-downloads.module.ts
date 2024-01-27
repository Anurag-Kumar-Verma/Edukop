import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfflineDownloadRoutingModule } from './offline-download-routing.module';
import { OfflineDownloadsComponent } from './offline-downloads.component';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [OfflineDownloadsComponent],
  imports: [
    CommonModule,
    OfflineDownloadRoutingModule,
    FormsModule,
    IonicModule
  ],
  providers: [File, FileTransfer],
})
export class OfflineDownloadsModule { }
