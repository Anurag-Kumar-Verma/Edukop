import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, NavController, Platform } from '@ionic/angular';
import * as interfaces from '@spundan-clients/bookz-interfaces';
import { environment } from 'src/environments/environment';
import { CartService } from '../cart/services/cart-service';
import { PayService } from '../pay/services/pay.service';
import { LoaderService } from '../shared/loader/loader.service';
import { RouteService } from '../shared/services/router.service';
import { SharedService } from '../shared/services/shared.service';
import { ToastService } from '../shared/services/toast.service';
import { CartStateService } from '../shared/state/cart.state';
import { Checkout } from 'capacitor-razorpay';
import { IOrder } from '../models/IOrder.model';
export interface IRazorPayCheckout {
    // tslint:disable-next-line: typedef
    on(arg0: string, successCallback: (success: object) => void);
    // tslint:disable-next-line: typedef
    open(options: {
        image: string;
        currency: string;
        key: string;
        order_id: string;
        name: string;
        prefill: { name: string; email: string; contact: string };
        theme: { color: string };
    });
}

declare var RazorpayCheckout: IRazorPayCheckout;

@Component({
    selector: 'app-order-placed',
    templateUrl: './order-placed.page.html',
    styleUrls: ['./order-placed.page.scss'],
})
export class OrderPlacedPage implements OnInit {
    status: interfaces.IOrderStatus;
    orderData: IOrder;
    imageApi: string;
    isLoading: boolean = false;
    razorPayData: interfaces.IRazorpay;
    razorpayId: string;
    razorPayStatus: string;
    userData: interfaces.IUser;
    isPayment: boolean = false;
    dat: string;

    constructor(
        public router: Router,
        public cartService: CartService,
        private cartState: CartStateService,
        public navCtrl: NavController,
        public loadingService: LoaderService,
        public toast: ToastService,
        public alertController: AlertController,
        public payService: PayService,
        public platform: Platform,
        public sharedService: SharedService,
        private ngZone: NgZone,
        public routeService: RouteService
    ) {
        // let url1: string[] = this.router.url.split('/');
        // this.platform.backButton.subscribeWithPriority(99999, () => {
        //     if (this.router.url === '/tab/order-placed/'+ url1[3]) {
        //     }
        // });
    }

    ngOnInit(): void {
        this.getUserInfo();
        this.imageApi = environment.thumbApi;
        if (history.state.order) {
            this.orderData = history.state.order;
        }
    }

    ionViewWillEnter(): void {
        this.loadingService.display(false);
    }

    private getUserInfo(): void {
        this.sharedService.getUserInfo().subscribe(res => {
            this.userData = res.DATA;

            if (history.state.isRetry) {
                this.retry();
            }
        });
    }

    ionViewDidEnter(): void { }

    back(): void {
        // this.navCtrl
        //     .navigateRoot('/tab/dashboard', {
        //         animationDirection: 'forward',
        //     })
        //     .catch();
        // localStorage.removeItem('orderData');
        this.routeService.navigateToBack('ionic');
    }

    retry(): void {
        this.razorpayId = this.orderData.retryId;
        this.razorPayStatus = this.orderData.status;
        this.payment();
    }

    payNow(): void {
        this.loadingService.display(true);
        const params = {
            orderId: this.orderData.orderId,
            totalAmount: this.orderData.totalAmount,
        };

        this.payService.createOrder(params).subscribe(
            res => {
                if (res) {
                    this.cartState.setCartState(0);
                    this.razorPayData = res.DATA;
                    this.razorpayId = res.DATA.razorpayId;
                    this.razorPayStatus = res.DATA.razorpayStatus;
                    if (this.razorPayStatus === 'created') {
                        this.payment();
                    }
                }
            },
            error => {
                this.loadingService.display(false);
                this.presentAlert('Something went wrong!').catch();
            }
        );
    }

    async payment(): Promise<void> {
        this.loadingService.display(false);
        try {
            const options = {
                description: 'Payment for Edukop',
                image:
                    'https://s3.ap-south-1.amazonaws.com/images.bookz.in/logo/Edkop.png',
                currency: 'INR',
                key: environment.razorPayKey,
                order_id: this.razorpayId,
                name:
                    this.userData.firstName + ' ' + this.userData.lastName ||
                    'Guest',
                prefill: {
                    name:
                        this.userData.firstName + ' ' + this.userData.lastName ||
                        // tslint:disable-next-line: strict-boolean-expressions
                        'Guest',
                    // tslint:disable-next-line: strict-boolean-expressions
                    email: this.userData.email || '',
                    // tslint:disable-next-line: strict-boolean-expressions
                    contact: this.userData.phoneNo || '',
                },
                theme: {
                    color: '#E03F45',
                },
            };
            // const successCallback = (success: {
            //     razorpay_order_id: string;
            //     razorpay_signature: string;
            //     razorpay_payment_id: string;
            // }) => {
            //     this.paymentVerify(success);
            // };
            // const cancelCallback = (error: object) => {
            //     // alert(error.description + ' (Error ' + error.code + ')');
            //     this.presentAlert('Payment Cancel').catch();
            // };

            // const failedCallback = (failed: object) => {
            //     this.presentAlert('Something went wrong!').catch();
            // };

            // RazorpayCheckout.on('payment.success', successCallback);
            // RazorpayCheckout.on('payment.cancel', cancelCallback);
            // RazorpayCheckout.on('payment.failed', failedCallback);
            // RazorpayCheckout.open(options);
            let data = (await Checkout.open(options as any));
            console.log(JSON.stringify(data.response));
            this.paymentVerify(data.response as any);
            // this.presentAlert(data.response);
        } catch (error) {
            // this.presentAlert(error.message); //Doesn't appear at all
        }

    }

    async presentAlert(msg: string): Promise<void> {
        const alert = await this.alertController.create({
            message: msg,
            buttons: ['Ok'],
        });
        await alert.present();
    }

    paymentVerify(success: {
        razorpay_order_id: string;
        razorpay_signature: string;
        razorpay_payment_id: string;
    }): void {
        this.loadingService.display(true);
        const orderId = success.razorpay_order_id;
        const signature = success.razorpay_signature;
        const razorpay_payment_id = success.razorpay_payment_id;
        const params = {
            razorpay_order_id: success.razorpay_order_id,
            razorpay_signature: success.razorpay_signature,
            razorpay_payment_id: success.razorpay_payment_id,
        };
        if (signature.length > 0) {
            this.payService.capturePayment(params).subscribe(
                res => {
                    this.loadingService.display(false);
                    if (
                        res['DATA'].status ===
                        interfaces.IOrderStatus.AwaitingFulfillment ||
                        res['DATA'].status === interfaces.IOrderStatus.Delivered
                    ) {
                        this.presentAlert('Payment successful').catch();
                        localStorage.setItem(
                            'orderData',
                            JSON.stringify(res.DATA)
                        );
                        this.cartState.setCartState(0);
                        this.ngZone.run(() => {
                            this.orderData = res.DATA as any;
                        });
                    } else {
                        this.presentAlert('Payment Failed!').catch();
                    }
                },
                error => {
                    this.loadingService.display(false);
                    this.presentAlert('Something went wrong!').catch();
                }
            );
        }
    }

    trackOrder(): void {
        this.router
            .navigateByUrl('/tab/my-order-details/' + Math.random(), {
                state: { order: this.orderData.uuid },
            })
            .catch();
    }
}
