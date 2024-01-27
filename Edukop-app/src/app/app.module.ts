import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { Network } from '@ionic-native/network/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicRatingModule } from 'ionic4-rating';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonViewModule } from './common/common-view.module';
import { CouponsComponent } from './coupons/coupons.component';
import { DashboardPageModule } from './dashboard/dashboard.module';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { FormListComponent } from './form-list/form-list.component';
import { SearchModalComponent } from './search-modal/search-modal.component';
import { LoaderModule } from './shared/loader/loader.module';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { Facebook } from '@ionic-native/facebook/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { SignupPage } from './signup-container/signup.page';

@NgModule({
    declarations: [
        AppComponent,
        SearchModalComponent,
        DynamicFormComponent,
        FormListComponent,
        CouponsComponent
    ],
    entryComponents: [SearchModalComponent],
    imports: [
        IonicRatingModule,
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        HttpClientModule,
        DashboardPageModule,
        CommonModule,
        CommonViewModule,
        LoaderModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    providers: [
        StatusBar,
        SplashScreen,
        Network,
        Facebook,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        File,
        FileTransfer,
        FileOpener,
    ],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
