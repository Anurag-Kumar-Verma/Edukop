import { Injectable, NgZone } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { filter } from 'rxjs/operators';
import { LoaderService } from '../loader/loader.service';
import { ProductStateService } from '../state/product.state';
import { ToastService } from './toast.service';

@Injectable({
    providedIn: 'root',
})
export class RouteService {
    private previousUrl: string;
    private currentUrl: string;
    private history: string[] = [];
    isExitCount: number = 1;
    constructor(
        private router: Router,
        private navCtrl: NavController,
        public modalCtrl: ModalController,
        public toast: ToastService,
        private platform: Platform,
        private loaderService: LoaderService,
        public productStateService: ProductStateService,
        public ngZone: NgZone
    ) {}

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

    async navigateToBack(action) {
        let currentUrl;
        // this.router.events.subscribe(event => {
        //     if (event instanceof NavigationEnd) {
        //         currentUrl = event.url;
        //     }
        // });
        document.addEventListener(
            'backbutton',
            function (event) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
            },
            false
        );
        let url = this.router.url;
        let url1: string[] = this.router.url.split('/');
        const addressType = localStorage.getItem('addressType');
        const storedUrl = localStorage.getItem('order-placed');
        localStorage.removeItem('guest-order');
        const modal = await this.modalCtrl.getTop();
        if (storedUrl !== undefined && storedUrl !== null) {
            url = storedUrl;
        }
        if (modal) {
            modal.dismiss().catch();
            return;
        }

        if (url === '/tab/dashboard' || currentUrl === '/') {
            if (modal) {
                modal.dismiss().catch();
                return;
            }
            this.quitVerify().catch();
            return;
        }

        // else if (url === '/login') {
        //     let route = localStorage.getItem('last-route');
        //     // tslint:disable-next-line: strict-boolean-conditions
        //     if (route) {
        //         if (route === '/buy-now') {
        //             //  route = '/cart';
        //             // this.navCtrl.navigateBack(route).catch();
        //                 this.navCtrl.back();
        //         } else if (route === '/cart') {
        //                 this.navCtrl.back();
        //             // this.navCtrl.navigateRoot(route).catch();
        //         } else if (route === '/wishlist') {
        //             // this.navCtrl.back();
        //             // route = '/product-page';

        //                 this.navCtrl.back();
        //             // this.router.navigateByUrl(route)
        //         } else {
        //             this.navCtrl.navigateRoot('/tab/dashboard').catch();
        //         }
        //     } else {
        //         this.navCtrl.navigateRoot('/tab/dashboard').catch();
        //     }
        //     localStorage.removeItem('last-route');
        //     localStorage.removeItem('guest-route');
        // } else if (url === '/tab/my-account') {
        //     this.navCtrl
        //         .navigateRoot('/tab/dashboard', {
        //             animationDirection: 'forward',
        //         })
        //         .catch();
        // }  else if (url === '/tab/coupons/'+ url1[3]) {
        //     this.router.navigateByUrl('/cart');
        //         this.navCtrl.back();
        // } else if (url === '/tab/sub-categories/' + url1[3]) {
        //    this.navCtrl.navigateRoot('/tab/dashboard');
        // } else if (url === '/tab/form-list/' + url1[3]) {
        //     localStorage.setItem('history-back', '/product-page');
        //     const route = localStorage.getItem('form-list-back');
        //     if (route) {
        //         this.router.navigateByUrl('/sub-categories');
        //     } else {
        //         this.router.navigateByUrl('/tab/dashboard');
        //     }
        //     localStorage.removeItem('form-list-back');
        // } else if (url === '/tab/dynamic-form/'+ url1[3]) {
        //     localStorage.setItem('history-back', '/product-page');
        //     this.router.navigateByUrl('/form-list').catch();
        // } else if (url === '/tab/add-address/'+ url1[3]) {
        //         this.navCtrl.back();
        // } else if (url === '/tab/my-orders') {
        //     this.navCtrl
        //         .navigateRoot('/tab/dashboard', {
        //             animationDirection: 'forward',
        //         })
        //         .catch();
        // } else if (url === '/tab/buy-now/'+ url1[3]) {
        //     localStorage.removeItem('guest-order');
        //     // const route = localStorage.getItem('route');
        //     // this.router.navigateByUrl('/tab/'+route).catch();
        //     this.navCtrl.back();
        // } else if (this.router.url === '/tab/order-placed/'+ url1[3]) {
        //     this.navCtrl
        //         .navigateRoot('/tab/dashboard', {
        //             animationDirection: 'forward',
        //         })
        //         .catch();
        // } else if (url === '/tab/cart/'+ url1[3]) {
        //     const route = localStorage.getItem('cart-back');
        //     this.navCtrl.back();
        //     // tslint:disable-next-line: strict-boolean-conditions
        //     // if (route) {
        //     //     this.navCtrl.navigateRoot(route).catch();
        //     // } else {
        //     //         this.navCtrl.back();
        //     // }
        //     localStorage.removeItem('route');
        //     localStorage.removeItem('guest-cart');
        //     localStorage.removeItem('cart-back');
        //     localStorage.removeItem('last-route');
        // }
        else if (
            url === '/tab/change-address/' + url1[3] ||
            url === '/tab/change-address/my-account' ||
            url === '/tab/change-address/buy-now/' + url1[3]
        ) {
            if (addressType === 'my-account') {
                this.router.navigateByUrl('/tab/my-account').catch();
                localStorage.removeItem('addressType');
            } else if (addressType === 'buy-now') {
                this.router.navigateByUrl('/buy-now').catch();
                localStorage.removeItem('addressType');
            } else {
                this.navCtrl.back();
            }
        } else if (url === '/tab/my-order-details/' + url1[3]) {
            this.navCtrl
                .navigateBack('/tab/my-orders', {
                    animationDirection: 'back',
                })
                .catch();
        } else if (url === '/tab/my-orders' || url === '/my-orders') {
            this.navCtrl.navigateRoot('/tab/dashboard');
        } else if (url === '/tab/my-account') {
            this.navCtrl.navigateRoot('/tab/dashboard');
        } else if (url === '/tab/pay/' + url1[3]) {
            this.navCtrl.navigateRoot('/tab/dashboard');
        } else if (url === '/tab/sub-categories/' + url1[3]) {
            this.navCtrl.navigateRoot('/tab/dashboard');
        }
        // else if (url === '/tab/form-list/' + url1[3]) {
        //     localStorage.setItem('history-back', '/product-page');
        //     const route = localStorage.getItem('form-list-back');
        //     if (route) {
        //         this.router.navigateByUrl('/tab/sub-categories/'+url1[3]);
        //     } else {
        //         this.router.navigateByUrl('/tab/dashboard');
        //     }
        //     localStorage.removeItem('form-list-back');
        // }
        else if (this.router.url === '/tab/order-placed/' + url1[3]) {
            this.navCtrl
                .navigateRoot('/tab/dashboard', {
                    animationDirection: 'forward',
                })
                .catch();
        } else if (url === '/tab/coupons/' + url1[3]) {
            const route = localStorage.getItem('coupons-back');
            this.ngZone.run(() => {
                if (route === 'buyNow') {
                    this.router
                        .navigateByUrl('/tab/buy-now/' + Math.random(), {
                            skipLocationChange: true,
                        })
                        .catch();
                } else {
                    this.router
                        .navigateByUrl('/tab/cart/' + Math.random(), {
                            skipLocationChange: true,
                        })
                        .catch();
                }
            });
            localStorage.removeItem('coupons-back');
        } else if (url === 'tab/add-address/' + url1[3]) {
            this.navCtrl.back();
            //this.router.navigateByUrl('/tab/change-address/16',{replaceUrl : true}).catch();
        }
        //  else if (url === '/tab/product-list/'+ url1[3]) {
        //      if (modal) {
        //         modal.dismiss().catch();
        //     }
        //     const route = localStorage.getItem('product-list-back');
        //     localStorage.removeItem('state');
        //     // tslint:disable-next-line: strict-boolean-conditions
        //     if (route) {
        //         this.router.navigateByUrl(route).catch();
        //     } else {
        //             this.navCtrl.back();
        //     }
        //     localStorage.removeItem('product-list-back');
        //     localStorage.removeItem('product-list');
        // } else if (url === '/tab/all-categories' || url === '/all-categories') {
        //     if (modal) {
        //         modal.dismiss().catch();
        //     }
        //     this.navCtrl
        //         .navigateRoot('/tab/dashboard', {
        //             animationDirection: 'back',
        //         })
        //         .catch();
        // } else if (url === '/tab/user-info/'+ url1[3]) {
        //     this.router.navigateByUrl('/tab/my-account').catch();
        // } else if (url === '/tab/child-category/'+ url1[3]) {
        //     const route: string = localStorage.getItem('child-category-back');
        //     // if (route) {
        //     //     this.router.navigateByUrl(route);
        //     // } else {
        //     //         this.navCtrl.back();
        //     // }
        //     this.navCtrl.back();
        //     localStorage.removeItem('child-category-back');
        // } else if (url === '/tab/product-page/'+ url1[3]) {
        //     const route = localStorage.getItem('back-route');
        //     if (route) {
        //         route === '/product-page'
        //             ? this.router.navigateByUrl('/tab/dashboard')
        //             : this.router.navigateByUrl(route).catch();
        //         localStorage.removeItem('back-route');
        //     } else {
        //             this.navCtrl.back();
        //     }
        //     localStorage.setItem('history-back', '/product-page');
        //     // tslint:disable-next-line: strict-boolean-conditions
        //     if (this.productStateService.currentProductValue) {
        //         this.productStateService.setProductState(undefined);
        //     }
        // }
        else {
            this.navCtrl.back();
        }
        this.loaderService.display(false);
    }

    // async navigateToBack(action) {
    //     let currentUrl;
    //     // this.router.events.subscribe(event => {
    //     //     if (event instanceof NavigationEnd) {
    //     //         currentUrl = event.url;
    //     //     }
    //     // });
    //     document.addEventListener(
    //         'backbutton',
    //         function (event) {
    //             event.preventDefault();
    //             event.stopPropagation();
    //             event.stopImmediatePropagation();
    //         },
    //         false
    //     );
    //     let url = this.router.url;
    //     const addressType = localStorage.getItem('addressType');
    //     const storedUrl = localStorage.getItem('order-placed');
    //     const modal = await this.modalCtrl.getTop();
    //     if (storedUrl !== undefined && storedUrl !== null) {
    //         url = storedUrl;
    //     }
    //     if (modal) {
    //         modal.dismiss().catch();
    //         return;
    //     }

    //     if (url === '/tab/dashboard' || currentUrl === '/') {
    //         if (modal) {
    //             modal.dismiss().catch();
    //             return;
    //         }
    //         this.quitVerify().catch();
    //         return;
    //     } else if (url === '/login') {
    //         let route = localStorage.getItem('last-route');
    //         // tslint:disable-next-line: strict-boolean-conditions
    //         if (route) {
    //             if (route === '/buy-now') {
    //                 //  route = '/cart';
    //                 // this.navCtrl.navigateBack(route).catch();
    //                 if (action === 'ionic') {
    //                     this.navCtrl.back();
    //                 }
    //             } else if (route === '/cart') {
    //                 if (action === 'ionic') {
    //                     this.navCtrl.back();
    //                 }
    //                 // this.navCtrl.navigateRoot(route).catch();
    //             } else if (route === '/wishlist') {
    //                 // this.navCtrl.back();
    //                 // route = '/product-page';

    //                 if (action === 'ionic') {
    //                     this.navCtrl.back();
    //                 }
    //                 // this.router.navigateByUrl(route)
    //             } else {
    //                 this.navCtrl.navigateRoot('/tab/dashboard').catch();
    //             }
    //         } else {
    //             this.navCtrl.navigateRoot('/tab/dashboard').catch();
    //         }
    //         localStorage.removeItem('last-route');
    //         localStorage.removeItem('guest-route');
    //     } else if (url === '/tab/my-account') {
    //         this.navCtrl
    //             .navigateRoot('/tab/dashboard', {
    //                 animationDirection: 'forward',
    //             })
    //             .catch();
    //     } else if (url === '/child-category') {
    //         const route: string = localStorage.getItem('child-category-back');
    //         // tslint:disable-next-line: strict-boolean-conditions
    //         if (route) {
    //             this.router.navigateByUrl(route).catch();
    //         } else {
    //             if (action === 'ionic') {
    //                 this.navCtrl.back();
    //             }
    //         }
    //         localStorage.removeItem('child-category-back');
    //         localStorage.removeItem('child-category');
    //     } else if (url === '/coupons') {
    //         this.router.navigateByUrl('/cart');
    //         if (action === 'ionic') {
    //             this.navCtrl.back();
    //         }
    //     } else if (url === '/sub-categories') {
    //         localStorage.removeItem('sub-categories');
    //     } else if (url === '/form-list') {
    //         localStorage.setItem('history-back', '/product-page');
    //         const route = localStorage.getItem('form-list-back');
    //         if (route) {
    //             this.router.navigateByUrl('/sub-categories');
    //         } else {
    //             this.router.navigateByUrl('/tab/dashboard');
    //         }
    //         localStorage.removeItem('form-list-back');
    //     } else if (url === '/dynamic-form') {
    //         localStorage.setItem('history-back', '/product-page');
    //         this.router.navigateByUrl('/form-list').catch();
    //     } else if (url === '/add-address') {
    //         if (action === 'ionic') {
    //             this.navCtrl.back();
    //         }
    //     } else if (url === '/tab/my-orders') {
    //         this.navCtrl
    //             .navigateRoot('/tab/dashboard', {
    //                 animationDirection: 'forward',
    //             })
    //             .catch();
    //     } else if (url === '/buy-now') {
    //         localStorage.removeItem('guest-order');
    //         const route = localStorage.getItem('route');
    //         this.router.navigateByUrl(route).catch();
    //     } else if (this.router.url === '/order-placed') {
    //         this.navCtrl
    //             .navigateRoot('/tab/dashboard', {
    //                 animationDirection: 'forward',
    //             })
    //             .catch();
    //     } else if (url === '/cart') {
    //         const route = localStorage.getItem('cart-back');
    //         // tslint:disable-next-line: strict-boolean-conditions
    //         if (route) {
    //             this.navCtrl.navigateRoot(route).catch();
    //         } else {
    //             if (action === 'ionic') {
    //                 this.navCtrl.back();
    //             }
    //         }
    //         localStorage.removeItem('route');
    //         localStorage.removeItem('guest-cart');
    //         localStorage.removeItem('cart-back');
    //         localStorage.removeItem('last-route');
    //     } else if (
    //         url === '/change-address' ||
    //         url === '/change-address/my-account' ||
    //         url === '/change-address/buy-now'
    //     ) {
    //         if (addressType === 'my-account') {
    //             this.router.navigateByUrl('/tab/my-account').catch();
    //             localStorage.removeItem('addressType');
    //         } else if (addressType === 'buy-now') {
    //             this.router.navigateByUrl('/buy-now').catch();
    //             localStorage.removeItem('addressType');
    //         } else {
    //             if (action === 'ionic') {
    //                 this.navCtrl.back();
    //             }
    //         }
    //     } else if (url === '/my-order-details') {
    //         this.navCtrl
    //             .navigateBack('/tab/my-orders', {
    //                 animationDirection: 'back',
    //             })
    //             .catch();
    //     } else if (url === '/tab/my-orders' || url === '/my-orders') {
    //         if (action === 'ionic') {
    //             this.navCtrl.back();
    //         }
    //     } else if (url === '/pay') {
    //         if (action === 'ionic') {
    //             this.navCtrl.back();
    //         }
    //     } else if (url === '/wishlist') {
    //         const route = localStorage.getItem('back-route-wishlist');
    //         // tslint:disable-next-line: strict-boolean-conditions
    //         if (route) {
    //             this.navCtrl.navigateRoot('/tab/dashboard').catch();
    //         } else {
    //             if (action === 'ionic') {
    //                 this.navCtrl.back();
    //             }
    //         }
    //         localStorage.removeItem('back-route-wishlist');
    //     } else if (url === '/product-list') {
    //         if (modal) {
    //             modal.dismiss().catch();
    //         }
    //         const route = localStorage.getItem('product-list-back');
    //         localStorage.removeItem('state');
    //         // tslint:disable-next-line: strict-boolean-conditions
    //         if (route) {
    //             this.router.navigateByUrl(route).catch();
    //         } else {
    //             if (action === 'ionic') {
    //                 this.navCtrl.back();
    //             }
    //         }
    //         localStorage.removeItem('product-list-back');
    //         localStorage.removeItem('product-list');
    //     } else if (url === '/tab/all-categories' || url === '/all-categories') {
    //         if (modal) {
    //             modal.dismiss().catch();
    //         }
    //         this.navCtrl
    //             .navigateRoot('/tab/dashboard', {
    //                 animationDirection: 'back',
    //             })
    //             .catch();
    //     } else if (url === '/user-info') {
    //         this.router.navigateByUrl('/tab/my-account').catch();
    //     } else if (url === '/child-category') {
    //         const route: string = localStorage.getItem('child-category-back');
    //         if (route) {
    //             this.router.navigateByUrl(route);
    //         } else {
    //             if (action === 'ionic') {
    //                 this.navCtrl.back();
    //             }
    //         }
    //         localStorage.removeItem('child-category-back');
    //     } else if (url === '/product-page') {
    //         const route = localStorage.getItem('back-route');
    //         if (route) {
    //             route === '/product-page'
    //                 ? this.router.navigateByUrl('/tab/dashboard')
    //                 : this.router.navigateByUrl(route).catch();
    //             localStorage.removeItem('back-route');
    //         } else {
    //             if (action === 'ionic') {
    //                 this.navCtrl.back();
    //             }
    //         }
    //         localStorage.setItem('history-back', '/product-page');
    //         // tslint:disable-next-line: strict-boolean-conditions
    //         if (this.productStateService.currentProductValue) {
    //             this.productStateService.setProductState(undefined);
    //         }
    //     } else {
    //         this.platform.backButton.subscribeWithPriority(9999, () => {
    //             return;
    //         });
    //     }
    //     this.loaderService.display(false);
    // }

    // async navigateToBack(action) {
    //     let currentUrl;
    //     // this.router.events.subscribe(event => {
    //     //     if (event instanceof NavigationEnd) {
    //     //         currentUrl = event.url;
    //     //     }
    //     // });

    //     let url = this.router.url;
    //     const addressType = localStorage.getItem('addressType');
    //     const storedUrl = localStorage.getItem('order-placed');
    //     //console.log(this.router.url.lastIndexOf("/"));

    //     let url1: string[] = this.router.url.split('/');

    //     if (action === 'ionic') {
    //         if (url === '/tab/all-categories') {
    //             this.navCtrl.pop();
    //             return;
    //         } else if (url === '/login') {
    //             this.navCtrl.pop();
    //             localStorage.removeItem('last-route');
    //             localStorage.removeItem('guest-route');
    //             return;
    //         } else if (url === '/tab/my-orders') {
    //             this.navCtrl.pop();
    //             return;
    //         } else if (url === '/tab/my-account') {
    //             this.navCtrl.pop();
    //             return;
    //         } else if (url === '/tab/order-placed/' + url[2]) {
    //             this.navCtrl.navigateRoot('/tab/dashboard');
    //         } else if (url === '/tab/product-page/' + url1[2]) {
    //             if (this.productStateService.currentProductValue) {
    //                 this.productStateService.setProductState(undefined);
    //             }
    //             this.navCtrl.pop();
    //             return;
    //         } else if (
    //             url === '/tab/change-address' ||
    //             url === '/tab/change-address/my-account' ||
    //             url === '/tab/change-address/buy-now'
    //         ) {
    //             if (addressType === 'my-account') {
    //                 this.router.navigateByUrl('/tab/my-account').catch();
    //                 localStorage.removeItem('addressType');
    //             } else if (addressType === 'buy-now') {
    //                 // this.router.navigateByUrl('/buy-now').catch();
    //                 this.navCtrl.pop();

    //                 localStorage.removeItem('addressType');
    //             } else {
    //                 this.navCtrl.pop();
    //             }
    //         } else if (url === '/tab/form-list/' + url1[2]) {
    //             localStorage.setItem('history-back', '/product-page');
    //             const route = localStorage.getItem('form-list-back');
    //             if (route) {
    //                 this.navCtrl.pop();
    //             } else {
    //                 this.router.navigateByUrl('/tab/dashboard');
    //             }
    //             localStorage.removeItem('form-list-back');
    //             return;
    //         } else if (url === '/tab/dynamic-form/' + url1[2]) {
    //             localStorage.setItem('history-back', '/product-page');
    //             // this.router.navigateByUrl('/form-list').catch();
    //             this.navCtrl.pop();
    //             return;
    //         } else {
    //             this.navCtrl.pop();
    //         }
    //     } else {
    //         //this.router.navigateByUrl(url);
    //         // this.navCtrl.pop();
    //         //  return
    //         // const modal = await this.modalCtrl.getTop();
    //         // if (modal) {
    //         //     modal.dismiss().catch();
    //         //     return;
    //         // }
    //         // // else if (url === '/order-placed/' + url1[2]) {
    //         // //     this.navCtrl.navigateRoot('/tab/dashboard');
    //         // // }
    //         // if (url === '/tab/dashboard' || currentUrl === '/') {
    //         //     if (modal) {
    //         //         modal.dismiss().catch();
    //         //         return;
    //         //     }
    //         //     this.quitVerify().catch();
    //         //     return;
    //         // }
    //         //     if (url === '/tab/dashboard' || currentUrl === '/') {
    //         //         if (modal) {
    //         //             modal.dismiss().catch();
    //         //             return;
    //         //         }
    //         //         this.quitVerify().catch();
    //         //         return;
    //         if (url === '/tab/dashboard' || currentUrl === '/') {
    //             // if (modal) {
    //             //     modal.dismiss().catch();
    //             //     return;
    //             // }
    //             this.quitVerify().catch();
    //         } else if (
    //             url === '/tab/change-address/' + url1[2] ||
    //             url === '/tab/change-address/my-account' ||
    //             url === '/tab/change-address/buy-now/' + url1[2]
    //         ) {
    //             if (addressType === 'my-account') {
    //                 this.router.navigateByUrl('/tab/my-account').catch();
    //                 localStorage.removeItem('addressType');
    //             } else if (addressType === 'buy-now') {
    //                 this.router.navigateByUrl('/buy-now').catch();
    //                 localStorage.removeItem('addressType');
    //             } else {
    //                 this.navCtrl.pop();
    //             }
    //         }
    //         if (url === '/tab/all-categories') {
    //             this.navCtrl.navigateRoot('/tab/dashboard');
    //         } else if (url === '/tab/order-placed/' + url1[2]) {
    //             this.navCtrl.navigateRoot('/tab/dashboard');
    //             return;
    //         } else if (url === '/tab/my-orders') {
    //             this.navCtrl.navigateRoot('/tab/dashboard');
    //         } else if (url === '/tab/my-account') {
    //             this.navCtrl.navigateRoot('/tab/dashboard');
    //         } else {
    //             console.log('aayooup');

    //             this.navCtrl.pop();
    //         }
    //         // if (url === '/tab/all-categories') {
    //         //     this.platform.backButton.subscribeWithPriority(9999, () => {
    //         //         return;
    //         //     });
    //         // }
    //         // else if (url === '/tab/my-orders') {
    //         //     this.platform.backButton.subscribeWithPriority(9999, () => {
    //         //         return;
    //         //     });
    //         // }
    //         //  if (url === '/tab/my-account') {
    //         //    this.platform.backButton.subscribeWithPriority(9999999999,() => {
    //         //         return null;
    //         //     });
    //         //     return null
    //         // }
    //         //else {
    //         //     this.navCtrl.back();
    //         //     return
    //         // }
    //         // const modal = await this.modalCtrl.getTop();
    //         // url === '/tab/dashboard' || currentUrl === '/'
    //         //     ? modal
    //         //         ? modal.dismiss()
    //         //         : this.quitVerify().catch()
    //         //     : '';
    //         // else if (url === '/all-categories/' + url1[2]) {
    //         //     this.navCtrl
    //         //         .navigateRoot('/tab/dashboard', {
    //         //             animationDirection: 'back',
    //         //         })
    //         //         .catch();
    //         // }
    //         //  else if (
    //         //     url === '/change-address' ||
    //         //     url === '/change-address/my-account' ||
    //         //     url === '/change-address/buy-now'
    //         // ) {
    //         //     if (addressType === 'my-account') {
    //         //         this.router.navigateByUrl('/tab/my-account').catch();
    //         //         localStorage.removeItem('addressType');
    //         //     } else if (addressType === 'buy-now') {
    //         //         this.router.navigateByUrl('/buy-now').catch();
    //         //         localStorage.removeItem('addressType');
    //         //     } else {
    //         //         this.navCtrl.back();
    //         //     }
    //         // } else if (url === '/form-list/' + url1[2]) {
    //         //     localStorage.setItem('history-back', '/product-page');
    //         //     const route = localStorage.getItem('form-list-back');
    //         //     if (route) {
    //         //         this.navCtrl.back();
    //         //     } else {
    //         //         this.router.navigateByUrl('/tab/dashboard');
    //         //     }
    //         //     localStorage.removeItem('form-list-back');
    //         //     return;
    //         // } else if (url === '/dynamic-form/' + url1[2]) {
    //         //     localStorage.setItem('history-back', '/product-page');
    //         //     this.router.navigateByUrl('/form-list').catch();
    //         //     return;
    //         // }
    //         // else {
    //         //     this.navCtrl.back();
    //         // }
    //     }

    //     // else if (url === '/tab/my-account') {
    //     //     this.navCtrl
    //     //         .navigateRoot('/tab/dashboard', {
    //     //             animationDirection: 'forward',
    //     //         })
    //     //         .catch();
    //     // } else if (url === '/child-category') {
    //     //     const route: string = localStorage.getItem('child-category-back');
    //     //     // tslint:disable-next-line: strict-boolean-conditions
    //     //     this.navCtrl.back();
    //     //     localStorage.removeItem('child-category-back');
    //     //     localStorage.removeItem('child-category');
    //     // } else if (url === '/coupons') {
    //     //     this.router.navigateByUrl('/cart');
    //     //     this.navCtrl.back();
    //     // } else if (url === '/sub-categories') {
    //     //     localStorage.removeItem('sub-categories');
    //     // } else if (url === '/form-list') {
    //     //     localStorage.setItem('history-back', '/product-page');
    //     //     this.navCtrl.back();
    //     //     localStorage.removeItem('form-list-back');
    //     // } else if (url === '/dynamic-form') {
    //     //     localStorage.setItem('history-back', '/product-page');
    //     //     this.navCtrl.back();
    //     // } else if (url === '/add-address') {
    //     //     if (action === 'ionic') {
    //     //         this.navCtrl.back();
    //     //     }
    //     // } else if (url === '/tab/my-orders') {
    //     //     this.navCtrl
    //     //         .navigateRoot('/tab/dashboard', {
    //     //             animationDirection: 'forward',
    //     //         })
    //     //         .catch();
    //     // } else if (url === '/buy-now') {
    //     //     localStorage.removeItem('guest-order');
    //     //     const route = localStorage.getItem('route');
    //     //     this.navCtrl.back();
    //     // } else if (url === '/order-placed') {
    //     //     this.navCtrl
    //     //         .navigateRoot('/tab/dashboard', {
    //     //             animationDirection: 'forward',
    //     //         })
    //     //         .catch();
    //     // } else if (url === '/cart') {
    //     //     this.navCtrl.back();
    //     //     localStorage.removeItem('route');
    //     //     localStorage.removeItem('guest-cart');
    //     //     localStorage.removeItem('cart-back');
    //     //     localStorage.removeItem('last-route');
    //     // } else if (
    //     //     url === '/change-address/'+url[2] ||
    //     //     url === '/change-address/my-account' ||
    //     //     url === '/change-address/buy-now/'+url[2]
    //     // ) {
    //     //     if (addressType === 'my-account') {
    //     //         this.navCtrl.back();
    //     //         localStorage.removeItem('addressType');
    //     //     } else if (addressType === 'buy-now') {
    //     //         this.navCtrl.back();
    //     //         localStorage.removeItem('addressType');
    //     //     } else {
    //     //         if (action === 'ionic') {
    //     //             this.navCtrl.back();
    //     //         }
    //     //     }
    //     // } else if (url === '/my-order-details') {
    //     //     this.navCtrl
    //     //         .navigateBack('/tab/my-orders', {
    //     //             animationDirection: 'back',
    //     //         })
    //     //         .catch();
    //     // } else if (url === '/tab/my-orders' || url === '/my-orders') {
    //     //     if (action === 'ionic') {
    //     //         this.navCtrl.back();
    //     //     }
    //     // } else if (url === '/pay') {
    //     //     if (action === 'ionic') {
    //     //         this.navCtrl.back();
    //     //     }
    //     // } else if (url === '/wishlist') {
    //     //     this.navCtrl.back();
    //     //     localStorage.removeItem('back-route-wishlist');
    //     // } else if (url === '/product-list') {
    //     //     this.navCtrl.back();
    //     //     localStorage.removeItem('product-list-back');
    //     //     localStorage.removeItem('product-list');
    //     // } else if (url === '/tab/all-categories' || url === '/all-categories') {
    //     //     this.navCtrl.back();
    //     // } else if (url === '/user-info') {
    //     //     this.router.navigateByUrl('/tab/my-account').catch();
    //     // } else if (url === '/child-category') {
    //     //     const route: string = localStorage.getItem('child-category-back');
    //     //     if (route) {
    //     //         this.router.navigateByUrl(route);
    //     //     } else {
    //     //         if (action === 'ionic') {
    //     //             this.navCtrl.back();
    //     //         }
    //     //         this.navCtrl.back();
    //     //     }
    //     //     localStorage.removeItem('child-category-back');
    //     // } else if (url === '/product-page') {
    //     //     // const route = localStorage.getItem('back-route');
    //     //     // if (route) {
    //     //     //     route === '/product-page'
    //     //     //         ? this.router.navigateByUrl('/tab/dashboard')
    //     //     //         : this.router.navigateByUrl(route).catch();
    //     //     //     localStorage.removeItem('back-route');
    //     //     // } else {
    //     //     //     if (action === 'ionic') {
    //     //     this.navCtrl.back();
    //     //     //     }
    //     //     // }
    //     //     // localStorage.setItem('history-back', '/product-page');
    //     //     // tslint:disable-next-line: strict-boolean-conditions
    //     //     if (this.productStateService.currentProductValue) {
    //     //         this.productStateService.setProductState(undefined);
    //     //     }
    //     //     return;
    //     // }
    //     // else {
    //     //     this.platform.backButton.subscribeWithPriority(9999, () => {
    //     //         return;
    //     //     });
    //     // }
    //     this.loaderService.display(false);
    // }
}
