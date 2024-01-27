import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicRatingModule } from 'ionic4-rating';
import { IonicModule } from '@ionic/angular';
import { ReviewPageRoutingModule } from './review-routing.module';

import { ReviewPage } from './review.page';

@NgModule({
    imports: [
        IonicRatingModule,
        CommonModule,
        FormsModule,
        IonicModule,
        ReviewPageRoutingModule,
    ],
    declarations: [ReviewPage],
})
export class ReviewPageModule {}
