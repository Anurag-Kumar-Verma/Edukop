import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
    FileTransfer,
    FileTransferObject,
} from '@ionic-native/file-transfer/ngx';
import { PdfViewerComponent } from './pdf-viewer.component';

const routes: Routes = [
    {
        path: '',
        component: PdfViewerComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [FileTransfer, FileTransferObject],
})
export class PDFViewerRoutingModule {}
