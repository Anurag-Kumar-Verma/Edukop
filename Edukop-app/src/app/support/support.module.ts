import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicRatingModule } from 'ionic4-rating';
import { IonicModule } from '@ionic/angular';
import { SupportRoutingModule } from './support-routing.module';
import { SupportComponent } from './support.component';


@NgModule({
  imports: [
    IonicRatingModule,
    CommonModule,
    FormsModule,
    IonicModule,
    SupportRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [SupportComponent]
})
export class SupportModule {}
