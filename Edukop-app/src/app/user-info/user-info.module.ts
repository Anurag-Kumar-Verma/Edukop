import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { IonicModule } from '@ionic/angular';
import { UserInfoPageRoutingModule } from './user-info-routing.module';
import { UserInfoPage } from './user-info.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        UserInfoPageRoutingModule,
        ReactiveFormsModule,
        HttpClientModule,
    ],
    declarations: [UserInfoPage],
    providers: [Camera, File],
})
export class UserInfoPageModule {}
