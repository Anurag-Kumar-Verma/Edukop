import {
    AfterViewInit,
    Component,
    QueryList,
    ViewChildren,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Network } from '@ionic-native/network/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {
    AlertController,
    IonRouterOutlet,
    ModalController,
    NavController,
    Platform,
} from '@ionic/angular';

import { AuthService } from './auth/services/auth.service';
import { LoaderService } from './shared/loader/loader.service';
import { RouteService } from './shared/services/router.service';
import { SharedService } from './shared/services/shared.service';
import { ToastService } from './shared/services/toast.service';
import { internetConnectivityState } from './shared/state/internetConnectivity.state';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
})
export class AppComponent implements AfterViewInit {
    @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;
    isExitCount: number = 1;
    isDisconnected: boolean;

    constructor(
        private platform: Platform,
        private router: Router,
        public toast: ToastService,
        private internetState: internetConnectivityState,
        public modalCtrl: ModalController,
        public sharedService: SharedService,
        private authService: AuthService,
        private network: Network,
        public alertController: AlertController,
        public loaderService: LoaderService,
        private RouteService: RouteService
    ) {
        this.initializeApp();
        this.backButtonEvent();
    }

    async quitVerify(): Promise<void> {
        if (this.isExitCount > 1) {
            navigator['app'].exitApp();
        }
        this.isExitCount++;
        this.toast.showToast('Please click back again to exit', 'end').catch();
        setTimeout(() => {
            this.isExitCount = 1;
        }, 3000);
    }

    initializeApp(): void {
        this.platform
            .ready()
            .then(() => {
                //      this.statusBar.hide();
                this.listenConnection();
                this.guestUser();
            })
            .catch();
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            document.getElementById('bookz-logo').style.display = 'block';
        }, 30000);
    }

    private listenConnection(): void {
        this.network.onChange().subscribe(ss => {
            const isConnected = ss['type'] === 'online' ? true : false;
            setTimeout(() => {
                this.internetState.setState(isConnected);
            }, 3000);
        });

        this.network.onConnect().subscribe(async ss => {
            const isConnected = ss.type === 'online' ? true : false;
            this.internetState.setState(isConnected);
        });

        this.network.onDisconnect().subscribe(ss => {
            const isConnected = ss.type === 'online' ? true : false;
            setTimeout(() => {
                this.loaderService.display(false);
                this.internetState.setState(isConnected);
            }, 3000);
        });
    }

    guestUser(): void {
        if (
            this.authService.currentUserValue === undefined ||
            this.authService.currentUserValue === null
        ) {
            this.authService.guestUserLogin();
        }
    }

    backButtonEvent(): void {
        this.platform.backButton.subscribe(async () => {
            await this.RouteService.navigateToBack('platform').then(a => {
                return;
            });
            // // tslint:disable-next-line: prefer-const
            // let currentUrl;
            // // this.router.events.subscribe(event => {
            // //     if (event instanceof NavigationEnd) {
            // //         currentUrl = event.url;
            // //     }
            // // });
            // let url = this.router.url;
            // const addressType = localStorage.getItem('addressType');
            // const storedUrl = localStorage.getItem('order-placed');
            // const modal = await this.modalCtrl.getTop();
            // if (storedUrl !== undefined && storedUrl !== null) {
            //     url = storedUrl;
            // }
            // if (modal) {
            //     modal.dismiss().catch();
            //     return;
            // }
            // if (url === '/tab/dashboard' || currentUrl === '/') {
            //     if (modal) {
            //         modal.dismiss().catch();
            //         return;
            //     }
            //     this.quitVerify().catch();
            //     return;
            // } else if (url === '/login') {
            //     let route = localStorage.getItem('last-route');
            //     // tslint:disable-next-line: strict-boolean-conditions
            //     if (route) {
            //         if (route === '/buy-now') {
            //             route = '/product-page';
            //             this.navCtrl.navigateBack(route).catch();
            //         } else if (route === '/cart') {
            //             this.navCtrl.navigateRoot(route).catch();
            //         } else {
            //             this.navCtrl.navigateRoot('/tab/dashboard').catch();
            //         }
            //     } else {
            //         this.navCtrl.navigateRoot('/tab/dashboard').catch();
            //     }
            //     localStorage.removeItem('last-route');
            //     localStorage.removeItem('guest-route');
            //     return;
            // } else if (url === '/tab/my-account') {
            //     this.navCtrl
            //         .navigateRoot('/tab/dashboard', {
            //             animationDirection: 'forward',
            //         })
            //         .catch();
            //     return;
            // } else if (url === '/class-list') {
            //     const route: string = localStorage.getItem('class-list-back');
            //     // tslint:disable-next-line: strict-boolean-conditions
            //     if (route) {
            //         this.navCtrl.navigateBack(route).catch();
            //     } else {
            //         this.navCtrl.back();
            //     }
            //     localStorage.removeItem('child-category-back');
            //     return;
            // } else if (url === '/form-list') {
            //     localStorage.setItem('history-back', '/product-page');
            //     this.navCtrl.navigateBack('/sub-categories').catch();
            // } else if (url === '/dynamic-form') {
            //     localStorage.setItem('history-back', '/product-page');
            //     this.navCtrl.navigateBack('/form-list').catch();
            // } else if (url === '/add-address') {
            //     this.navCtrl.back();
            //     return;
            // } else if (url === '/tab/my-orders') {
            //     this.navCtrl
            //         .navigateRoot('/tab/dashboard', {
            //             animationDirection: 'forward',
            //         })
            //         .catch();
            //     return;
            // } else if (url === '/buy-now') {
            //     localStorage.removeItem('guest-order');
            //     const route = localStorage.getItem('route');
            //     this.navCtrl.navigateBack(route).catch();
            //     return;
            // } else if (url === '/cart') {
            //     const route = localStorage.getItem('route');
            //     // tslint:disable-next-line: strict-boolean-conditions
            //     if (route) {
            //         this.navCtrl.navigateRoot('/tab/dashboard').catch();
            //     } else {
            //         this.navCtrl.back();
            //     }
            //     localStorage.removeItem('route');
            //     localStorage.removeItem('guest-cart');
            // } else if (
            //     url === '/change-address' ||
            //     url === '/change-address/my-account' ||
            //     url === '/change-address/buy-now'
            // ) {
            //     if (addressType === 'my-account') {
            //         this.router.navigateByUrl('/tab/my-account').catch();
            //         localStorage.removeItem('addressType');
            //     } else if (addressType === 'buy-now') {
            //         this.router.navigateByUrl('/buy-now').catch();
            //         localStorage.removeItem('addressType');
            //     } else {
            //         this.navCtrl.back();
            //     }
            // } else if (url === '/my-order-details') {
            //     this.navCtrl
            //         .navigateBack('/tab/my-orders', {
            //             animationDirection: 'back',
            //         })
            //         .catch();
            //     return;
            // } else if (url === '/tab/my-orders' || url === '/my-orders') {
            //     this.navCtrl.back();
            //     return;
            // } else if (url === '/pay') {
            //     this.navCtrl.back();
            //     return;
            // } else if (url === '/wishlist') {
            //     const route = localStorage.getItem('back-route-wishlist');
            //     // tslint:disable-next-line: strict-boolean-conditions
            //     if (route) {
            //         this.navCtrl.navigateRoot('/tab/dashboard').catch();
            //     } else {
            //         this.navCtrl.back();
            //     }
            //     localStorage.removeItem('back-route-wishlist');
            //     return;
            // } else if (url === '/product-list') {
            //     if (modal) {
            //         modal.dismiss().catch();
            //         return;
            //     }
            //     const route = localStorage.getItem('product-list-back');
            //     localStorage.removeItem('state');
            //     // tslint:disable-next-line: strict-boolean-conditions
            //     if (route) {
            //         this.navCtrl.navigateBack(route).catch();
            //     } else {
            //         this.navCtrl.back();
            //     }
            //     localStorage.removeItem('product-list-back');
            // } else if (
            //     url === '/tab/all-categories' ||
            //     url === '/all-categories'
            // ) {
            //     if (modal) {
            //         modal.dismiss().catch();
            //         return;
            //     }
            //     this.navCtrl
            //         .navigateRoot('/tab/dashboard', {
            //             animationDirection: 'forward',
            //         })
            //         .catch();
            //     return;
            // } else if (url === '/user-info') {
            //     this.navCtrl.navigateBack('/tab/my-account').catch();
            //     return;
            // } else if (url === '/board-list') {
            //     return;
            // } else if (url === '/product-page') {
            //     return;
            // } else {
            //     this.platform.backButton.subscribeWithPriority(9999, () => {
            //         return;
            //     });
            // }
            // this.loaderService.display(false);
        });
    }
}
