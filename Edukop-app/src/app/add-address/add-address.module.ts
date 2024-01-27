import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AddAddressPageRoutingModule } from './add-address-routing.module';
import { AddAddressPage } from './add-address.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        AddAddressPageRoutingModule,
    ],
    declarations: [AddAddressPage],
})
export class AddAddressPageModule {}
