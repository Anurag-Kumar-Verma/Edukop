import { Component, OnInit } from '@angular/core';
import { NavigationExtras, NavigationStart, Router } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import * as interfaces from '@spundan-clients/bookz-interfaces';
import { filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { AddressService } from '../add-address/service/address.service';
import { AuthService } from '../auth/services/auth.service';
import { OrderSummaryService } from '../buy-now/services/order-summary.service';
import { LoaderService } from '../shared/loader/loader.service';
import { RouteService } from '../shared/services/router.service';
import { SharedService } from '../shared/services/shared.service';

@Component({
    selector: 'app-my-account',
    templateUrl: './my-account.page.html',
    styleUrls: ['./my-account.page.scss'],
})
export class MyAccountPage implements OnInit {
    userInfo: interfaces.IUser;
    myAddressess: interfaces.IAddress;
    isLoading: boolean;
    recentOrder: interfaces.IOrder;
    isExitCount: number = 1;
    imageApi: string;
    constructor(
        public router: Router,
        private navCtrl: NavController,
        public authService: AuthService,
        public sharedService: SharedService,
        private orderService: OrderSummaryService,
        public addressService: AddressService,
        public loadingService: LoaderService,
        public platform: Platform,
        public routeService: RouteService
    ) {
        // this.router.events
        //     .pipe(filter(event => event instanceof NavigationStart))
        //     .subscribe((route: NavigationStart) => {
        //         this.getAddress('router');
        //         this.getUserInfo();
        //     });
        // this.platform.backButton.subscribeWithPriority(9999, () => {
        //     this.navCtrl
        //         .navigateRoot('/tab/dashboard', {
        //             animationDirection: 'forward',
        //         })
        //         .catch();
        // });
    }

    ngOnInit(): void {
        this.imageApi = environment.thumbApi;

    }

    ionViewDidEnter(): void {
        this.getUserInfo();
        this.getAddress();

    }

    editInfo(): void {
        this.router.navigateByUrl('/tab/user-info/1201').catch();
    }

    getUserInfo(): void {
        this.loadingService.display(true);
        this.sharedService.getUserInfo().subscribe(
            response => {
                this.userInfo = response.DATA;
                this.getRecentOrder();
            },
            error => { }
        );
    }

    getAddress(): void {
        // if (action !== 'router') {
        //     this.loadingService.display(true);
        // }
        this.addressService.getDefaultAddress().subscribe(
            res => {
                this.myAddressess = res.DATA;
                if(this.myAddressess == null){
                    this.addressService.getAddress().subscribe(
                        res => {
                            this.myAddressess = res.DATA[0];
                        }
                    )
                } 
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

    myOrders(): void {
        this.router.navigateByUrl('/tab/my-orders').catch();
    }

    addAddress(): void {
        this.router.navigateByUrl('/tab/add-address/' + Math.random()).catch();
    }

    myAddress(): void {
        this.router
            .navigate(['/tab/change-address', 'my-account'], {
                replaceUrl: true,
            })
            .catch();
    }

    onLogout(): void {
        this.authService.logout();
        // this.router.navigateByUrl("/login");
    }
    getRecentOrder(): void {
        this.orderService.getOrder().subscribe(
            res => {
                if (res) {
                    this.recentOrder = res.DATA[0];
                    // this.getAddress();
                }
            },
            error => {
                // this.loadingService.display(true);
            }
        );
    }

    changePassword(){
        if(this.userInfo.uuid && (localStorage.getItem("isGuest") == 'false')){
            this.router.navigateByUrl("/tab/change-password");
        }
    }
}
