import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { LogintabsPageRoutingModule } from './logintabs-routing.module';
import { LogintabsPage } from './logintabs.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        LogintabsPageRoutingModule,
    ],
    declarations: [LogintabsPage],
})
export class LogintabsPageModule {}
