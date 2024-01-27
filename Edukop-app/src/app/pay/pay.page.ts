// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import {
//     AlertController,
//     LoadingController,
//     NavController,
//     Platform,
//     ToastController,
// } from '@ionic/angular';
// import { environment } from 'src/environments/environment';

// import { key } from '../auth/models/razorPay';
// import { AuthService } from '../auth/services/auth.service';
// import { CartService } from '../cart/services/cart-service';
// import { SharedService } from '../shared/services/shared.service';
// import { CartStateService } from '../shared/state/cart.state';

// import { PayService } from './services/pay.service';
// // declare var RazorpayCheckout: any;

// @Component({
//     selector: 'app-pay',
//     templateUrl: './pay.page.html',
//     styleUrls: ['./pay.page.scss'],
// })
// export class PayPage implements OnInit {
//     // cashOnDelivery: boolean = false;
//     // cardOption: boolean = false;
//     // payOptionCard: boolean = true;
//     // amount: number;
//     // orderUUID: string;
//     // userData: User;
//     // razorPayData: any;
//     // razorpayId: any;
//     // razorPayStatus: any;
//     // success: any;
//     // isLoading: boolean;
//     // constructor(
//     //     private navCtrl: NavController,
//     //     private router: Router,
//     //     public toastController: ToastController,
//     //     public sharedService: SharedService,
//     //     private cartService: CartService,
//     //     private cartState: CartStateService,
//     //     private payService: PayService,
//     //     public loadingController: LoadingController,
//     //     public alertCtrl: AlertController
//     // ) {}

//     ngOnInit(): void {
//         // this.router.getCurrentNavigation().extras.state;
//         // this.amount = history.state.amount;
//         // this.orderUUID = history.state.orderUUID;
//         // this.getUserInfo();
//         // if (this.success) {
//         //   this.successCallback(this.success);
//         // }
//     }

//     // private getUserInfo(): void {
//     //     this.presentLoading().catch();
//     //     this.sharedService.getUserInfo().subscribe((res: any) => {
//     //         this.loadingDismiss().catch(e => console.warn(e));
//     //         this.userData = res.DATA as User;
//     //     });
//     // }

//     // async presentToast(): Promise<void> {
//     //     const toast = await this.toastController.create({
//     //         message: 'Order Placed',
//     //         duration: 2000,
//     //     });
//     //     toast.present().catch();
//     // }

//     // async presentLoading(): Promise<void> {
//     //     this.isLoading = true;

//     //     const loading = await this.loadingController
//     //         .create({
//     //             message: 'Please wait...',
//     //             // duration: 5000,
//     //         })
//     //         .then(a => {
//     //             a.present()
//     //                 .then(() => {
//     //                     if (!this.isLoading) {
//     //                         a.dismiss().then().catch();
//     //                     }
//     //                 })
//     //                 .catch();
//     //         });
//     // }

//     // async loadingDismiss(): Promise<boolean> {
//     //     this.isLoading = false;
//     //     return this.loadingController.dismiss();
//     // }

//     // cashOn(): void {
//     //     this.cashOnDelivery = true;
//     //     this.payOptionCard = false;
//     // }

//     // backToPay(): void {
//     //     this.cashOnDelivery = false;
//     //     this.cardOption = false;
//     //     this.payOptionCard = true;
//     // }

//     // cardOpt(): void {
//     //     this.cardOption = true;
//     //     this.payOptionCard = false;
//     // }

//     // goback(): void {
//     //     this.navCtrl.back();
//     // }

//     // payNow(): void {
//     //     this.presentLoading().catch();
//     //     const params = {
//     //         amount: this.amount * 100,
//     //         orderId: this.orderUUID,
//     //     };

//     //     this.payService.createOrder(params).subscribe(
//     //         res => {
//     //             if (res) {
//     //                 this.razorPayData = res.DATA;
//     //                 this.razorpayId = res.DATA.razerpayId;
//     //                 this.razorPayStatus = res.DATA.razerpayStatus;
//     //                 if (this.razorPayStatus === 'created') {
//     //                     this.payment();
//     //                 }
//     //             }
//     //         },
//     //         error => {
//     //             this.loadingDismiss().catch();
//     //             this.presentAlert('Something went wrong!').catch();
//     //         }
//     //     );
//     // }

//     // payment(): void {
//     //     this.loadingDismiss().catch();
//     //     const options = {
//     //         description: 'Payment for Bookz',
//     //         image:
//     //             this.userData.imageUrl === ''
//     //                 ? environment.imageApi + this.userData.imageUrl
//     //                 : './assets/images/rsz_logo.jpg',
//     //         currency: 'INR',
//     //         key,
//     //         order_id: this.razorpayId,
//     //         amount: this.amount * 100,
//     //         name: this.userData.firstName + ' ' + this.userData.lastName,
//     //         theme: {
//     //             color: '#E03F45',
//     //         },
//     //     };
//     //     const successCallback = success => {
//     //         this.paymentVerify(success);
//     //     };
//     //     const cancelCallback = error => {
//     //         // alert(error.description + ' (Error ' + error.code + ')');
//     //         this.presentAlert('Payment Cancel').catch();
//     //     };

//     //     const failedCallback = failed => {
//     //         this.presentAlert('Something went wrong!').catch();
//     //     };

//     //     RazorpayCheckout.on('payment.success', successCallback);
//     //     RazorpayCheckout.on('payment.cancel', cancelCallback);
//     //     RazorpayCheckout.on('payment.failed', failedCallback);
//     //     RazorpayCheckout.open(options);
//     // }

//     // async presentAlert(msg: string): Promise<void> {
//     //     const alert = await this.alertCtrl.create({
//     //         message: msg,
//     //         buttons: ['Ok'],
//     //     });
//     //     await alert.present();
//     // }

//     // paymentVerify(success: any): void {
//     //     this.presentLoading().catch();
//     //     const orderId = success.razorpay_order_id;
//     //     const signature = success.razorpay_signature;
//     //     const razorpay_payment_id = success.razorpay_payment_id;
//     //     const params = {
//     //         razorpay_order_id: success.razorpay_order_id,
//     //         razorpay_signature: success.razorpay_signature,
//     //         razorpay_payment_id: success.razorpay_payment_id,
//     //     };
//     //     if (signature) {
//     //         this.payService.capturePayment(params).subscribe(
//     //             res => {
//     //                 this.loadingDismiss().catch();
//     //                 if (res.DATA.status === Status.AwaitingFulfillment) {
//     //                     this.presentAlert('Payment successful').catch();
//     //                     this.cartService
//     //                         .paymentOrder(this.orderUUID)
//     //                         .subscribe(response => {
//     //                             if (response) {
//     //                                 this.presentToast().catch();
//     //                                 this.cartState.setCartState(3);
//     //                                 // this.router.navigateByUrl("/order-placed");
//     //                                 this.navCtrl
//     //                                     .navigateForward('/order-placed')
//     //                                     .catch();
//     //                             }
//     //                         });
//     //                 } else {
//     //                     this.presentAlert('Payment Failed!').catch();
//     //                 }
//     //             },
//     //             error => {
//     //                 this.loadingDismiss().catch();
//     //                 this.presentAlert('Something went wrong!').catch();
//     //             }
//     //         );
//     //     }
//     // }

//     // // payment() {
//     // //   var options = {
//     // //     description: "Payment for Bookz",
//     // //     image: this.userData.image
//     // //       ? environment.imageApi + this.userData.image
//     // //       : "./assets/images/rsz_logo.jpg",
//     // //     currency: "INR",
//     // //     key: key,
//     // //     order_id: this.razorpayId,
//     // //     amount: this.amount * 100,
//     // //     name: this.userData.firstName + " " + this.userData.lastName,
//     // //     theme: {
//     // //       color: "#E03F45",
//     // //     },
//     // //   };
//     // //   var orderId;
//     // //   var signature;
//     // //   var razorpay_payment_id;
//     // //   var successCallback = function (success) {
//     // //     orderId = success.razorpay_order_id;
//     // //     signature = success.razorpay_signature;
//     // //     razorpay_payment_id = success.razorpay_payment_id;
//     // //
//     // //   };

//     // //   var cancelCallback = function (error) {
//     // //     alert(error.description + " (Error " + error.code + ")");
//     // //   };

//     // //   RazorpayCheckout.on("payment.success", successCallback);
//     // //   RazorpayCheckout.on("payment.cancel", cancelCallback);
//     // //   RazorpayCheckout.open(options);
//     // // }
// }
