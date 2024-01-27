import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ChangeAddressPageRoutingModule } from './change-address-routing.module';
import { ChangeAddressPage } from './change-address.page';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ChangeAddressPageRoutingModule,
    ],
    declarations: [ChangeAddressPage],
    providers: [Geolocation, NativeGeocoder, Diagnostic],
})
export class ChangeAddressPageModule {}
