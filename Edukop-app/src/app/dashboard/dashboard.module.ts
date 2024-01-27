import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonViewModule } from '../common/common-view.module';
import { DashboardPageRoutingModule } from './dashboard-routing.module';
import { DashboardPage } from './dashboard.page';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        CommonViewModule,
        IonicModule,
        DashboardPageRoutingModule,
        // RouterModule.forChild(AdminLayoutRoutes),
    ],
    declarations: [DashboardPage],
    providers: [SocialSharing],
})
export class DashboardPageModule {}
