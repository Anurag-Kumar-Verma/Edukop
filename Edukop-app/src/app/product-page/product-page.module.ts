import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {
    FileTransfer,
} from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { BookSetPage } from './product-page';
import { BookSetPageRoutingModule } from './product-page-routing.module';


@NgModule({
    imports: [CommonModule, FormsModule, IonicModule, BookSetPageRoutingModule],
    declarations: [BookSetPage],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [File, FileTransfer],
})
export class ProductPageModule {}
