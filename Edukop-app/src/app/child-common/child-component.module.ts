import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MainPipe } from '../shared/pipes/pipe.module';

import { ChildViewPage } from './child-view/child-view.component';

import { ExamChildViewPage } from './exam-child-view/exam-child-view.component';
// import { EnrollmentFormPage } from './enrollment-form/enrollment-form.component';
// import { RowViewPage } from './row-view/row-view.component';

@NgModule({
    imports: [CommonModule, FormsModule, IonicModule, MainPipe],
    declarations: [ChildViewPage, ExamChildViewPage],
    exports: [ChildViewPage, ExamChildViewPage],
})
export class ChildViewModule {}
