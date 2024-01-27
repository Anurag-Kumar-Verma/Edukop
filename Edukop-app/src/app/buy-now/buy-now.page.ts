import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonContent, NavController } from '@ionic/angular';
import * as interfaces from '@spundan-clients/bookz-interfaces';
import { environment } from 'src/environments/environment';
import { AddressService } from '../add-address/service/address.service';
import { CartService } from '../cart/services/cart-service';
import { PayService } from '../pay/services/pay.service';
import { LoaderService } from '../shared/loader/loader.service';
import { RouteService } from '../shared/services/router.service';
import { SharedService } from '../shared/services/shared.service';
import { ToastService } from '../shared/services/toast.service';
import { CartStateService } from '../shared/state/cart.state';
import { OrderSummaryService } from './services/order-summary.service';
import { Checkout } from 'capacitor-razorpay';
import { IOrderProduct } from '../models/IOrder.model';


interface Ij {
    on?: string;
}

export interface IRazorPayCheckout {
    // tslint:disable-next-line: typedef
    on(arg0: string, successCallback: (success: Ij) => void);
    // tslint:disable-next-line: typedef
    open(options: {
        description: string;
        image: string;
        currency: string;
        key: string;
        order_id: string;
        amount: number;
        name: string;
        prefill: { name: string; email: string; contact: string };
        theme: { color: string };
    });
}


@Component({
    selector: 'app-buy-now',
    templateUrl: './buy-now.page.html',
    styleUrls: ['./buy-now.page.scss'],
})
export class BuyNowPage implements OnInit {
    @ViewChild(IonContent) ionContent: IonContent;
    orderList: interfaces.IOrder;
    productList: IOrderProduct[] = [];
    history: interfaces.ICoupon;
    myAddress: interfaces.IAddress;
    isLoading: boolean = true;
    imageApi: string;
    selectedArray: Array<{
        mrp: number;
        sellingprice: number;
        productUUID: string;
        quantity: number;
    }> = [];
    productSum: number = 0;
    isGroupProduct: boolean = true;
    isExitCount: number = 1;
    sellingpriceSum: number = 0;
    mrpSum: number = 0;
    additionalValue: string[] | number[] = ['more'];
    quantityArray: number[][] = [];
    razorPayData: interfaces.IRazorpay;
    razorpayId: string;
    razorPayStatus: string;
    userData: interfaces.IUser;
    route: string;
    formAsproduct: boolean;
    type: string = 'buyNow';
    gstAdd: boolean;
    organization: string;
    gstNo: string;

    constructor(
        public router: Router,
        private navCtrl: NavController,
        public orderSummaryService: OrderSummaryService,
        public activateRoute: ActivatedRoute,
        private addressService: AddressService,
        public loadingService: LoaderService,
        public toast: ToastService,
        public alertController: AlertController,
        public payService: PayService,
        public sharedService: SharedService,
        private cartService: CartService,
        private cartState: CartStateService,
        public routeService: RouteService
    ) { }

    ngOnInit(): void {
        this.loadingService.display(true);
        this.activateRoute.data.subscribe(a => {
            if (!this.orderList) {
                console.log(this.orderList, '11111111111')
                let uuid: string;
                const order = JSON.parse(localStorage.getItem('guest-order'));
                if (order) {
                    console.log(order,'2222222222')
                    this.cartService.placeOrder(order).subscribe(res => {
                        console.log(res,'3333333')
                        // localStorage.setItem('uuid', res.DATA.uuid);
                        uuid = res.DATA.uuid;
                        this.getOrderData(uuid);
                    });
                } else {
                    uuid = localStorage.getItem('uuid');
                    this.getOrderData(uuid);
                }

                this.getUserInfo();
            } else {
                this.loadingService.display(false);
            }
        });
        // this.newGetOrder();
    }

    // newGetOrder(): void {
    //     if (!this.orderList) {
    //         let uuid: string;
    //         const order = JSON.parse(localStorage.getItem('guest-order'));
    //         if (order) {
    //             this.cartService.placeOrder(order).subscribe(res => {
    //                 // localStorage.setItem('uuid', res.DATA.uuid);
    //                 uuid = res.DATA.uuid;
    //                 this.getOrderData(uuid);
    //             });
    //         } else {
    //             uuid = localStorage.getItem('uuid');
    //             this.getOrderData(uuid);
    //         }

    //         this.getUserInfo();
    //     } else {
    //         // this.loadingService.display(false);
    //     }
    //     // ORDER DATA
    //     // this.orderSummaryService
    //     // .addAddressOnOrder(this.orderList, true)
    //     // .subscribe(res => {
    //     //     // this.loadingService.display(true);

    //     //     this.getOrderById(res.DATA.uuid);
    //     // });

    // }

    ionViewWillEnter(): void {
        // if (history.state.couponBuynow) {
        //      = history.state.couponBuynow?.applied_coupon;
        //     this.orderList = history.state.couponBuynow;
        //     this.payPage('');
        // }
    }

    ionViewWillLeave(): void {
        localStorage.removeItem('guest-order');
    }

    openCoupon(): void {
        this.router
            .navigateByUrl('/tab/coupons/' + this.orderList.uuid, {
                state: {
                    order: this.orderList,
                    type: this.type,
                },
                replaceUrl: true,
            })
            .catch();
        localStorage.setItem('coupons-back', '');
    }

    // private getOrderData(id: string): void {
    //     this.route = localStorage.getItem('route');
    //     this.imageApi = environment.imageApi;
    //     console.log(history.state);
    //     const uuid: string = history.state?.uid;
    //     if (uuid !== undefined && uuid !== null) {
    //         // tslint:disable-next-line: no-shadowed-variable
    //         this.addressService
    //             .getAddressById(uuid)
    //             // tslint:disable-next-line: no-shadowed-variable
    //             .subscribe(res => {
    //                 this.myAddress = res.DATA;
    //                 this.getOrderById(id);
    //                 /// this.loadingDismiss();
    //             });
    //     } else {
    //         // tslint:disable-next-line: no-shadowed-variable
    //         this.addressService.getDefaultAddress().subscribe(res => {
    //             this.myAddress = res.DATA;
    //             this.getOrderById(id);
    //         });
    //     }

    // }
    private getOrderData(id: string): void {
        this.route = localStorage.getItem('route');
        this.imageApi = environment.imageApi;
        console.log(history.state,'history.state');
        const uuid: string = history.state?.uid;
        if (uuid !== undefined && uuid !== null) {
            // tslint:disable-next-line: no-shadowed-variable
            this.addressService
                .getAddressById(uuid)
                // tslint:disable-next-line: no-shadowed-variable
                .subscribe(res => {
                    console.log(res,'44444444')
                    this.myAddress = res.DATA;
                    this.getOrderById(id);
                    /// this.loadingDismiss();
                });
        } else {
            // tslint:disable-next-line: no-shadowed-variable
            this.addressService.getDefaultAddress().subscribe(res => {
                console.log(res,'555555555')
                this.myAddress = res.DATA;
                this.getOrderById(id);
            });
        }
    }

    private getUserInfo(): void {
        this.sharedService.getUserInfo().subscribe(res => {
            this.userData = res.DATA;
        });
    }

    addGST(): void {
        this.ionContent.scrollToBottom(500);
        this.gstAdd = true;
    }

    onChangeQuantity(
        event: any,
        product: { uuid: string },
        i: number
    ): void {
        if (event.target.value > 0 && event.target.value !== 'more') {
            this.selectedArray.forEach(
                (a: { productUUID: string; quantity: number }) => {
                    if (a.productUUID === product.uuid) {
                        a.quantity = Number(event.target.value);
                    }
                }
            );
            this.payPage('');
            this.calculatePrice();
        } else {
            this.quantityModal(i).catch();
        }
        //  this.calculatePrice();
    }

    calculatePrice(): void {
        this.mrpSum = 0;
        this.sellingpriceSum = 0;
        this.productSum = 0;
        this.selectedArray.map(
            (a: { mrp: number; quantity: number; sellingprice: number }) => {
                this.mrpSum += a.mrp * a.quantity;
                this.sellingpriceSum += a.sellingprice * a.quantity;
            }
        );
    }

    calculateTotalAmount(quantity: number, sp: number): number {
        return sp * quantity;
    }

    // getOrder(): void {
    //   this.orderSummaryService.getOrder().subscribe((res: any) => {
    //     this.orderList = res.DATA as Order[];
    //     this.productList = res.DATA.products;
    //     // this.totalAmount =
    //   });
    // }
    getOrderById(uuid: string): void {
        this.orderSummaryService.getOrderById(uuid).subscribe(
            res => {
                this.orderList = res.DATA;
                this.history =
                    res.DATA?.applied_coupon === undefined
                        ? this.history
                        : res.DATA?.applied_coupon;
                // this.sellingpriceSum = res.DATA.totalAmount + 40;
                this.productList = res.DATA.products as any;
                this.formAsproduct = res.DATA.products[0].product.isDigital;

                this.productList.map((p : any, i: number) => {
                    console.log(p,'ppppppp')
                    const cart = {
                        productUUID: p.productUUID,
                        quantity: p.quantity,
                        mrp: p.product.mrp,
                        sellingprice: p.product.sellingprice,
                        // address: this.myAddress
                    };
                    console.log(cart,'cart')
                    this.additionalValue[i] = p.quantity;
                    this.quantityArrayMethod(i);
                    this.selectedArray.push(cart);
                });
                this.calculatePrice();
                this.orderList.address = this.myAddress?.uuid;
                this.loadingService.display(false);
                this.isLoading = false;
                // this.orderSummaryService
                // .addAddressOnOrder(this.orderList, true)
                // .subscribe(res => {
                //     // this.loadingService.display(true);
                //     this.getOrderById(res.DATA.uuid);
                // });
            },
            error => {
                this.loadingService.display(false);
            }
        );
    }

    calculateOfferPercentage(mrp: number, sellingPrice: number): string | 0 {
        return sellingPrice > mrp
            ? 0
            : (((mrp - sellingPrice) / mrp) * 100).toFixed();
    }

    async quantityModal(i: number): Promise<void> {
        const isError = false;

        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Enter Quantity',
            inputs: [
                {
                    name: 'quantity',
                    type: 'number',
                    placeholder: 'Quantity',
                    min: 1,
                    value: 1,
                    disabled: isError,
                },
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        this.productList[i].quantity = 1;
                    },
                },
                {
                    text: 'Apply',
                    role: 'apply',
                    cssClass: 'secondary',
                    handler: value => {
                        if (value.quantity < 1) {
                            this.toast
                                .showToast(
                                    "Quantity can't be less than 1",
                                    'end'
                                )
                                .catch();
                            this.productList[i].quantity = 1;
                        } else {
                            let inputValue = Number(value.quantity);

                            if (value.quantity > 10) {
                                this.toast
                                    .showToast(
                                        "We're sorry! Only 10 unit(s) allowed in each order",
                                        'end'
                                    )
                                    .catch();
                                inputValue = 10;
                            }
                            this.additionalValue[i] = inputValue.toString();
                            this.selectedArray.forEach(
                                (a: {
                                    productUUID: string;
                                    quantity: number;
                                }) => {
                                    if (
                                        a.productUUID ===
                                        this.productList[i].productUUID
                                    ) {
                                        a.quantity = inputValue;
                                    }
                                }
                            );
                            this.productList[i].quantity = inputValue;
                            this.payPage('');
                            this.quantityArrayMethod(i);
                            this.calculatePrice();
                            // this.addCart("update");
                        }
                    },
                },
            ],
        });
        alert.present().catch();
    }

    quantityArrayMethod(j: number): void {
        this.quantityArray[j] = [0];
        const a: number[] = [];
        const arrayLength =
            Number(this.additionalValue[j]) >= 5
                ? Number(this.additionalValue[j])
                : 5;
        for (let i = 1; i <= arrayLength; i++) {
            a.push(i);
        }
        this.quantityArray[j] = a;
    }

    addGstInfo(organizations: string, gstNos: string): void {
        Object.assign(this.orderList, {
            organization: organizations,
            gstNo: gstNos,
        });
        this.toast
            .showToast(
                "GST Info Submited",
                'end'
            )
            .catch();
    }

    payPage(action: string): void {
        const isAddress = action === 'pay' ? true : false;
        if (action === 'pay') {
            if (!this.myAddress) {
                this.router
                    .navigate(['/tab/change-address', 'buy-now'], {
                        replaceUrl: true,
                    })
                    .catch();
                // this.toast.showToast(
                //     'Please first select a default address.',
                //     'end'
                // );
                return;
            }
        }
        this.orderSummaryService
            .addAddressOnOrder(this.orderList, isAddress)
            .subscribe(res => {
                this.loadingService.display(true);

                this.getOrderById(res.DATA.uuid);
                // this.orderSummaryService.getOrderById().the

                if (action === 'pay') {
                    this.payNow();
                    // this.router.navigateByUrl("/pay", {
                    //   state: {
                    //     amount: this.sellingpriceSum,
                    //     orderUUID: this.orderList.uuid,
                    //   },
                    // });
                }
            });
    }

    addAddress(): void {
        this.router.navigateByUrl('/tab/change-address/16').catch();
    }

    payNow(): void {
        const shippingAmount = this.history
            ? this.history.couponCode === 'FREESHIPPING' &&
            this.history.couponStatus === 'SUCCESS'
            : false;
        const shippingCheck = this.orderList?.shipping_amount ? true : false;
        const route = localStorage.getItem('payment-route');
        const params: interfaces.IOrder = {
            // totalAmount: (this.orderList.totalAmount + 40) * 100,
            totalAmount: this.history
                ? (this.history?.effectiveAmount +
                    (shippingAmount
                        ? 0
                        : shippingCheck
                            ? this.orderList?.shipping_amount
                            : this.orderList.shipping_amount)) *
                100
                : (this.orderList.totalAmount +
                    (shippingAmount
                        ? 0
                        : shippingCheck
                            ? this.orderList?.shipping_amount
                            : this.orderList.shipping_amount)) *
                100,
            orderId: this.orderList.uuid,
        };
        console.log(params,'params')
        this.payService.createOrder(params).subscribe(
            res => {
                if (res) {
                    if (route === '/cart') {
                        this.cartState.setCartState(0);
                    }
                    this.razorPayData = res.DATA;
                    this.razorpayId = res.DATA.razorpayId;
                    this.razorPayStatus = res.DATA.razorpayStatus;
                    if (this.razorPayStatus === 'created') {
                        this.payment();
                    }
                }
            },
            error => {
                console.log(error,'error')
                this.loadingService.display(false);
                this.presentAlert('Something went wrong!').catch();
            }
        );
    }

    async payment(): Promise<void> {
        // this.loadingService.display(false);
        try {
            const options = {
                description: 'Payment for Edukop',
                image:
                    'https://s3.ap-south-1.amazonaws.com/images.bookz.in/logo/Edkop.png',
                currency: 'INR',
                key: environment.razorPayKey,
                order_id: this.razorpayId,
                amount: (this.sellingpriceSum + this.orderList.shipping_amount) * 100,
                name: this.userData.firstName
                    ? this.userData.firstName + ' ' + this.userData.lastName
                    : 'Guest',
                prefill: {
                    name:
                        this.userData.firstName + ' ' + this.userData.lastName ||
                        // tslint:disable-next-line: strict-boolean-expressions
                        'Guest',
                    // tslint:disable-next-line: strict-boolean-expressions
                    email: this.userData.email || '',
                    contact: this.userData.phoneNo ? this.userData.phoneNo : '',
                },
                theme: {
                    color: '#E03F45',
                },
            };
            let data = (await Checkout.open(options as any));
            console.log(JSON.stringify(data.response) + "AcmeCorp");
            this.paymentVerify(data.response as any);
            // this.presentAlert(data.response);
        } catch (error) {
            console.log(error,'66666666666666')
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
        const route = localStorage.getItem('payment-route');
        this.loadingService.display(true);
        const orderId = success.razorpay_order_id;
        const signature = success.razorpay_signature;
        const razorpay_payment_id = success.razorpay_payment_id;
        const params: interfaces.ICaptureRazorPayPayment = {
            razorpay_order_id: success.razorpay_order_id,
            razorpay_signature: success.razorpay_signature,
            razorpay_payment_id: success.razorpay_payment_id,
        };
        if (signature) {
            this.payService.capturePayment(params).subscribe(
                res => {
                    // this.loadingService.display(false);
                    if (
                        res['DATA'].status ===
                        interfaces.IOrderStatus.AwaitingFulfillment ||
                        res['DATA'].status === interfaces.IOrderStatus.Delivered
                    ) {
                        this.presentAlert('Payment successful').catch();
                        if (route === '/cart') {
                            this.cartState.setCartState(0);
                        }
                        // this.router.navigateByUrl("/order-placed");
                        this.router
                            .navigateByUrl(
                                '/tab/order-placed/' + res['DATA'].uuid,
                                {
                                    state: {
                                        order: res['DATA'],
                                    },
                                }
                            )
                            .catch();
                        // this.cartService.paymentOrder(this.orderList.uuid).subscribe((res: any) => {
                        //   if (res) {
                        //     //this.presentToast();

                        //   }
                        // });
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

    goback(): void {
        // this.navCtrl.navigateBack(this.route).catch();
        // localStorage.removeItem('guest-order');
        this.routeService.navigateToBack('ionic');
    }

    removeCoupon(orderUUID: string): void {
        this.orderSummaryService.removeCoupon(orderUUID).subscribe(
            result => {
                this.history = null;
                this.getOrderById(orderUUID);
            },
            error => {
                this.loadingService.display(false);
                this.presentAlert('Something went wrong!').catch();
            }
        );
    }
}
