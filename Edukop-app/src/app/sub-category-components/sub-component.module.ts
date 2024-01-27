import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CardViewPage } from './card-view/card-view.component';
import { EnrollmentFormPage } from './enrollment-form/enrollment-form.component';
import { RowViewPage } from './row-view/row-view.component';

@NgModule({
    imports: [CommonModule, FormsModule, IonicModule],
    declarations: [CardViewPage, RowViewPage, EnrollmentFormPage],
    exports: [CardViewPage, RowViewPage, EnrollmentFormPage],
})
export class SubComponentModule {}
