import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { IonInfiniteScroll, NavController } from '@ionic/angular';
import * as interfaces from '@spundan-clients/bookz-interfaces';
import { filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { OrderSummaryService } from '../buy-now/services/order-summary.service';
import { LoaderService } from '../shared/loader/loader.service';
import { RouteService } from '../shared/services/router.service';
import { SharedService } from '../shared/services/shared.service';

@Component({
    selector: 'app-my-orders',
    templateUrl: './my-orders.page.html',
    styleUrls: ['./my-orders.page.scss'],
})
export class MyOrdersPage implements OnInit {
    @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
    myOrders: interfaces.IOrder[];
    isLoading: boolean;
    isExitCount: number = 1;
    rate: any;
    uuid: any;
    imageUrl: string = environment.thumbApi;

    constructor(
        private navCtrl: NavController,
        private orderService: OrderSummaryService,
        private router: Router,
        public loadingService: LoaderService,
        public sharedService: SharedService,
        public routeService: RouteService
    ) {
        // this.router.events
        //     .pipe(filter(event => event instanceof NavigationStart))
        //     .subscribe((route: NavigationStart) => {
        //         this.ionViewWillEnter();
        //     });
    }

    ngOnInit(): void {
        this.myAllOrders();
        //this.getRating();
    }

    //     getRating(){
    // this.sharedService.getRating().subscribe(res => {
    // console.log(res)
    // })
    //     }

    ionViewDidEnter(): void {
        this.myAllOrders();
    }

    loadData(event: any): void {
        setTimeout(() => {
            this.infiniteScroll.complete().catch();
            if (this.myOrders.length === 100) {
                event.disabled = true;
            }
        }, 500);
    }

    myAllOrders(): void {
        this.loadingService.display(true);
        this.orderService.getOrder().subscribe(
            res => {
                this.myOrders = res.DATA;
                this.loadingService.display(false);
            },
            error => {
                this.loadingService.display(false);
            }
        );
    }

    goback(): void {
        // this.navCtrl.navigateRoot('/tab/dashboard').catch();
        this.routeService.navigateToBack('ionic');
    }

    openProduct(order: interfaces.IOrder): void {
        this.router
            .navigateByUrl('/tab/my-order-details/' + Math.random(), {
                state: {
                    order: order.uuid,
                },
            })
            .catch();
    }

    onRateChange(event, uuid) {
        this.rate = event;
        this.uuid = uuid;
        let rating = {
            stars: this.rate,
            product_uuid: this.uuid,
        };
        this.sharedService.addRating(rating).subscribe(res => {});
    }

    reviewPage(orderDetails: interfaces.IOrder): void {
        this.router
            .navigateByUrl('/tab/review/' + Math.random(), {
                state: {
                    // rate : uuid,
                    order: orderDetails,
                },
            })
            .catch();
    }
}
