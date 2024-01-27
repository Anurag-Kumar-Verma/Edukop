import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { LoaderComponent } from './loader.component';

@NgModule({
    imports: [CommonModule, FormsModule, IonicModule],
    declarations: [LoaderComponent],
    exports: [LoaderComponent],
})
export class LoaderModule {}
