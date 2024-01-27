import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, NavController } from '@ionic/angular';
import * as interfaces from '@spundan-clients/bookz-interfaces';
import { LoaderService } from '../shared/loader/loader.service';
import { SharedService } from '../shared/services/shared.service';

@Component({
    selector: 'app-faq',
    templateUrl: './faq.page.html',
    styleUrls: ['./faq.page.scss'],
})
export class FAQPage implements OnInit {
    @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
    faq: interfaces.IFAQ;

    constructor(
        private navCtrl: NavController,
        public loadingService: LoaderService,
        private sharedService: SharedService
    ) {}

    ngOnInit() {
        console.log(history.state)
        this.allFaq(history.state.pUUID);
    }
    goback(): void {
        this.navCtrl.back();
    }
    allFaq(uuid) {
        this.loadingService.display(true);
        this.sharedService.getFaq(uuid).subscribe(res => {
            console.log(res)
            this.faq = res;
            this.loadingService.display(false);
        });
    }
}
