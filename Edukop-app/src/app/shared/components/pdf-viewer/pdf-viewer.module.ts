import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
///import { BrowserModule } from '@angular/platform-browser';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { PdfViewerComponent } from './pdf-viewer.component';
import { PDFViewerRoutingModule } from './pdf-viewer-routing.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';
// import { PinchZoomModule } from 'ngx-pinch-zoom';


@NgModule({
    declarations: [PdfViewerComponent],
    imports: [
        //   BrowserModule,
        PDFViewerRoutingModule,
        PdfViewerModule,
        IonicModule.forRoot(),
        CommonModule,
        FormsModule,
        // PinchZoomModule,
        ReactiveFormsModule,
    ],
})
export class PDFViewerModule {}
