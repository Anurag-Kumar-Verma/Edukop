import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import * as interfaces from '@spundan-clients/bookz-interfaces';
import { CartService } from '../cart/services/cart-service';
import { LoaderService } from '../shared/loader/loader.service';
import { ToastService } from '../shared/services/toast.service';
import { SharedService } from '../shared/services/shared.service';
import { RouteService } from '../shared/services/router.service';

@Component({
    selector: 'app-coupons',
    templateUrl: './coupons.component.html',
    styleUrls: ['./coupons.component.scss'],
})
export class CouponsComponent implements OnInit {
    pageNumber: number = 0;
    pageLimit: number = 10;
    orderData: interfaces.ICart;
    couponCode: string;
    history: interfaces.ICart;
    couponResponse: interfaces.ICoupon;
    apply: boolean = false;
    error: boolean = false;
    type: any;
    allCoupons: any;
    couponApplied: any;
    cartProducts: interfaces.ICartProduct[] = [];
    constructor(
        public sharedService: SharedService,
        private router: Router,
        public cartService: CartService,
        public loadingService: LoaderService,
        public toastr: ToastService,
        private navCtrl: NavController,
        public routerService: RouteService
    ) { }

    ngOnInit(): void { }

    ionViewWillEnter(): void {
        this.getCoupon();
        this.history = history.state.order;
        this.cartProducts = history.state.cart;
        this.type = history.state.type;
        localStorage.setItem('coupons-back', this.type);
    }

    getCoupon(): void {
        const paginate: interfaces.IPaginate = {
            pageIndex: this.pageNumber + 1,
            pageSize: this.pageLimit,
        };
        this.sharedService.getCouponsByPagination(paginate).subscribe(res => {
            this.allCoupons = res.DATA.docs;
        });
    }
    applyCoupon(): void {
        this.loadingService.display(true);
        this.cartService.applyCoupon(this.history, this.couponCode).subscribe(
            res => {
                if (res.DATA) {
                    this.apply = true;
                    this.orderData = res.DATA;
                    this.couponResponse = res.DATA.applied_coupon;
                    this.couponApplied = res.DATA.applied_coupon.couponStatus;
                    this.loadingService.display(false);
                    if (this.couponApplied === 'SUCCESS') {
                        this.toastr.showToast('Coupon applied', 'end');
                    } else {
                        this.toastr.showToast(
                            res.DATA.applied_coupon.reason,
                            'end'
                        );
                    }
                } else {
                    this.error = true;
                    this.loadingService.display(false);
                    this.toastr.showToast(res.MESSAGE, 'end').catch();
                    this.toastr.showToast('This Coupon is not valid', 'end');
                }
            },
            error => {
                this.error = true;
                this.toastr
                    .showToast('This Coupon is not valid', 'end')
                    .catch();
                this.loadingService.display(false);
            }
        );
    }

    click(code: string): void {
        this.couponCode = code;
        this.applyCoupon();
    }

    getDiscountAmount(): number {
        if (this.couponResponse.couponStatus === 'SUCCESS') {
            if (this.couponResponse.is_shipping_discount) {
                return Math.abs(this.couponResponse.shippingFree);
            } else {
                return Math.abs(this.couponResponse.couponDiscount);
            }
        }
    }

    goback(): void {
        this.routerService.navigateToBack(this.type);
    }

    updateCart(): void {
        if (this.couponApplied !== 'SUCCESS') {
            return;
        }
        const cartProductArray: interfaces.ICartProduct[] = [];
        let cart: interfaces.ICart;
        this.cartProducts.forEach(product => {
            const prodt: interfaces.ICartProduct = {
                mrp: product.mrp,
                productUUID: product.productUUID,
                quantity: product.quantity,
                sellingPrice: product.sellingPrice,
                vendorId: product.vendorId,
            };
            cartProductArray.push(prodt);
        });

        cart = {
            products: cartProductArray,
            applied_coupon: this.couponResponse,
            // totalAmount: this.productSum,
        };
        this.cartService.updateCart(cart).subscribe(
            res => {
                this.router
                    .navigateByUrl('/tab/cart/' + Math.random(), {
                        skipLocationChange: true,
                    })
                    .catch();
            },
            error => {
                // this.loadingDismiss();
            }
        );
    }

    updateOrder() {
        if (this.couponApplied !== 'SUCCESS') {
            return;
        }
        const order: any = this.history;
        Object.assign(this.history, { applied_coupon: this.couponResponse });

        this.cartService.placeOrder(order).subscribe(
            res => {
                this.router
                    .navigateByUrl('/tab/buy-now/' + Math.random(), {
                        skipLocationChange: true,
                    })
                    .catch();
            },

            error => { }
        );
    }

    goToCart(): void {
        if (this.type === 'buyNow') {
            this.updateOrder();
        } else {
            this.updateCart();
        }
    }
}
