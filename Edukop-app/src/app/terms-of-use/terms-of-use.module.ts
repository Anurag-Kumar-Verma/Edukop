import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicRatingModule } from 'ionic4-rating';
import { IonicModule } from '@ionic/angular';
import { TermsOfUseComponent } from './terms-of-use.component';
import { TermsOfuseRoutingModule } from './terms-of-use-routing.module';

@NgModule({
    imports: [
        IonicRatingModule,
        CommonModule,
        FormsModule,
        IonicModule,
        TermsOfuseRoutingModule,
    ],
    declarations: [TermsOfUseComponent],
})
export class TermsOfUseModule {}
