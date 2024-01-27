import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
    AlertController,
    NavController,
    PopoverController,
} from '@ionic/angular';
import * as interfaces from '@spundan-clients/bookz-interfaces';
import { ICart } from '@spundan-clients/bookz-interfaces';
import { environment } from 'src/environments/environment';

import { AuthService } from '../auth/services/auth.service';
import { DashboardService } from '../dashboard/service/dashboard.service';
import { GProductModalComponent } from '../g-product-modal/g-product-modal.component';
import { IBrowsingHistory } from '../models/IBrowsingHistory.model';
import { LoaderService } from '../shared/loader/loader.service';
import { RouteService } from '../shared/services/router.service';
import { ToastService } from '../shared/services/toast.service';
import { CartStateService } from '../shared/state/cart.state';
import { Wishlist } from '../wishlist/model/wishList.model';
import { WishlistService } from '../wishlist/service/wishlist.service';

import { CartService } from './services/cart-service';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.page.html',
    styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
    cartBadge: number;
    getCartData: interfaces.ICart;
    constructor(
        public router: Router,
        public cartService: CartService,
        private auth: AuthService,
        private navCtrl: NavController,
        public loadingService: LoaderService,
        public cartStateService: CartStateService,
        public wishlistService: WishlistService,
        public alertController: AlertController,
        public toast: ToastService,
        public dashboardService: DashboardService,
        public popoverController: PopoverController,
        public routeService: RouteService
    ) {}
    // private navCtrl: NavController;
    cartResponse: interfaces.ICart;
    productList: interfaces.ICartProduct[] = [];
    products: interfaces.IProduct;
    imageApi: string;
    quantity: number = 1;
    sum: number = 0;
    cartProducts: interfaces.ICartProduct[] = [];
    cartUUID: string;
    myAddress: interfaces.IAddress;
    isLoading: boolean;
    iconActive: boolean;
    wishListData: Wishlist | IBrowsingHistory;
    default: number;
    wishList: boolean;
    isExitCount: number = 1;
    sellingpriceSum: number = 0;
    mrpSum: number = 0;
    additionalValue: string[] | number[] = ['more'];
    quantityArray: number[][] = [];
    noData: boolean = false;
    history: interfaces.ICoupon;
    wishlistProductIds: string[] = [];
    cartState: number = 0;
    ngOnInit(): void {
        // this.cartStateService.getCartState().subscribe(val => {
        //     if (val !== undefined) {
        //         this.cartBadge = val;
        //     } else {
        //         // this.getCarts();
        //     }
        // });
        // this.imageApi = environment.imageApi;
        //  this.getCarts();
        // this.getWishList();
    }

    openCoupon(): void {
        this.router
            .navigateByUrl('/tab/coupons/' + this.cartResponse.uuid, {
                state: {
                    order: this.cartResponse,
                    cart: this.cartProducts,
                },
                replaceUrl: true,
            })
            .catch();
        //  localStorage.setItem('coupons-back', '/tab/cart');
    }
    addToCartFromWishList(product: interfaces.IProduct): void {
        this.wishList = false;
        this.cartProducts = [];
        const productDetails = {
            productUUID: product.uuid,
            quantity: 1,
            sellingPrice: product.sellingprice,
            mrp: product.mrp,
            vendorId: product.vendorId,
        };
        this.cartProducts.push(productDetails);
        this.addCart('add');
    }

    ionViewWillEnter(): void {
        this.imageApi = environment.thumbApi;
        // localStorage.setItem('last-route', this.router.url);
        this.getWishList();
        this.guestAddCart();

        if (history.state.coupon) {
            this.getCarts();
        }
    }

    guestAddCart(): void {
        const guestOrder = JSON.parse(localStorage.getItem('guest-cart'));
        if (guestOrder && this.auth.currentGuestUserValue === undefined) {
            this.cartService.addCart(guestOrder).subscribe(
                res => {
                    if (res) {
                        localStorage.removeItem('guest-cart');
                        this.cartStateService.setCartState(this.cartBadge++);
                        this.getCarts();
                        // this.loadingService.display(false);
                    }

                    // this.router.navigateByUrl("/cart");
                },
                error => {
                    this.loadingService.display(false);
                }
            );
        } else {
            this.getCarts();
        }
    }

    async presentPopover(ev: interfaces.IGroupProduct): Promise<void> {
        const popover = await this.popoverController.create({
            component: GProductModalComponent,
            cssClass: 'popover-class',
            //   event: ev,
            componentProps: { event: ev },
            translucent: true,
        });
        return popover.present();
    }

    addCart(action: string): void {
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
            // totalAmount: this.productSum,
        };

        if (this.auth.currentGuestUserValue !== undefined) {
            localStorage.setItem('guest-cart', JSON.stringify(cart));
        }
        const service =
            action === 'add'
                ? this.cartService.addCart(cart)
                : this.cartService.updateCart(cart);

        service.subscribe(
            res => {
                if (res) {
                    this.cartStateService.setCartState(this.cartBadge++);

                    // this.wishList = false;
                    // this.loadingDismiss();
                    this.getCarts();
                    // this.presentToast();
                }

                // this.router.navigateByUrl("/cart");
            },
            error => {
                // this.loadingDismiss();
            }
        );
    }

    productPage(product: interfaces.IProduct): void {
        this.wishList = false;
        const uuid = product.uuid;
        const d1 = 'productById?uuid=' + uuid;
        this.router
            .navigateByUrl('/tab/product-page/' + Math.random(), {
                state: { filter: d1, type: 'Product', uuid },
            })
            .catch();
        localStorage.setItem('cart-back', '/tab/dashboard');
        //    localStorage.setItem('last-route', '/cart');
    }

    addWishList(uuid: string, action: string): void {
        if (this.auth.currentGuestUserValue) {
            this.router.navigateByUrl('/tab/wishlist/' + Math.random()).catch();
            return;
        }
        this.loadingService.display(true);
        this.iconActive = true;
        const products = [];
        products.push({ productUUID: uuid });

        const wishlistParams = {
            products,
        };
        this.wishlistService.addWishList(wishlistParams).subscribe(
            res => {
                if (res) {
                    if (action === 'add') {
                        this.toast
                            .showToast('Product is added to wishlist', 'end')
                            .catch();
                    } else if (action === 'remove') {
                        this.toast
                            .showToast(
                                'Product is removed from wishlist',
                                'end'
                            )
                            .catch();
                    }
                    this.getWishList();
                    this.loadingService.display(false);
                }
            },
            error => {
                this.loadingService.display(false);
            }
        );
    }

    getRecentProducts(): void {
        this.dashboardService.getRecentProducts().subscribe(res => {
            this.wishListData = res.DATA as any;
        });
    }

    getWishList(): void {
        // this.presentLoading();

        this.wishlistService.getWishList().subscribe(
            res => {
                if (res.DATA && res.DATA.products.length > 0) {
                    this.wishListData = res.DATA;
                    this.wishlistProductIds = this.wishListData.products.map(
                        e => e.productUUID
                    );
                } else {
                    this.getRecentProducts();
                    this.wishlistProductIds = [];
                }
                this.loadingService.display(false);
            },
            error => {
                //  this.loadingDismiss();
            }
        );
    }

    isWishListed(uuid: string): boolean {
        if (this.wishlistProductIds.includes(uuid)) {
            return true;
        } else {
            return false;
        }
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
                            this.cartProducts.forEach(a => {
                                if (
                                    a.productUUID ===
                                    this.productList[i].product.uuid
                                ) {
                                    a.quantity = inputValue;
                                }
                            });
                            this.productList[i].quantity = inputValue;
                            // this.calculatePrice();
                            this.addCart('update');
                        }
                    },
                },
            ],
        });
        alert.present().catch();
    }

    // private applyCoupon(cart: ICart, code: string): void {
    //     this.cartService.applyCoupon(cart, code).subscribe(couponData => {
    //         if (couponData.DATA.applied_coupon.couponStatus === 'FAILED') {
    //             this.history = couponData.DATA.applied_coupon;
    //             this.toast.showToast(
    //                 couponData.DATA.applied_coupon.reason,
    //                 'end'
    //             );
    //         } else {
    //             this.history = couponData.DATA.applied_coupon;
    //         }
    //     });
    // }

    getCarts(): void {
        this.cartProducts = [];
        this.loadingService.display(true);
        this.cartService.getCart().subscribe(
            res => {
                this.cartResponse = res.DATA;
                if (res.DATA !== null && res.DATA !== undefined) {
                    this.getCartData = res.DATA;
                    this.productList = res.DATA.products;
                    this.history = res.DATA.applied_coupon;
                    this.cartUUID = res.DATA.uuid;
                    this.cartStateService.setCartState(
                        res.DATA.products.length
                    );

                    this.cartBadge = res.DATA.products.length;
                    res.DATA.products.map(
                        (p: interfaces.ICartProduct, i: number) => {
                            const cart = {
                                // mrp: p.product.mrp,
                                productUUID: p.productUUID,
                                quantity: p.quantity,
                                product: p.product,
                                vendorDetail: p.vendorDetail,
                                vendorProduct: p.inventory,
                                // sellingPrice: p.sellingPrice,
                                vendorId: p.vendorId,

                                // address: this.myAddress
                            };
                            this.additionalValue[i] = p.quantity;
                            this.quantityArrayMethod(i);
                            this.cartProducts.push(cart);
                        }
                    );
                    // this.calculatePrice();
                }
                this.noData = true;
                this.loadingService.display(false);
            },
            error => {
                this.loadingService.display(false);
            }
        );
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

    onChangeQuantity(
        event: any,
        product: interfaces.IProduct,
        i: number
    ): void {
        if (event.target.value > 0 && event.target.value !== 'more') {
            this.cartProducts.forEach(a => {
                if (a.productUUID === product.uuid) {
                    a.quantity = Number(event.target.value);
                }
            });
            // this.calculatePrice();
            this.addCart('update');
        } else {
            this.quantityModal(i).catch();
        }
    }

    // calculatePrice(): void {
    //     this.mrpSum = 0;
    //     this.sellingpriceSum = 0;
    //     this.cartProducts.map(a => {
    //         this.mrpSum += a.mrp * a.quantity;
    //         this.sellingpriceSum += a.sellingPrice * a.quantity;
    //     });
    // }

    calculateOfferPercentage(mrp: number, sellingPrice: number): string | 0 {
        return sellingPrice > mrp
            ? 0
            : (((mrp - sellingPrice) / mrp) * 100).toFixed();
    }
    openWishlist(): void {
        this.wishList = true;
    }

    payPage(): void {
        const cartProductArray: interfaces.ICartProduct[] = [];
        this.cartProducts.forEach(cart => {
            const product: interfaces.ICartProduct = {
                productUUID: cart.productUUID,
                quantity: cart.quantity,
                product: cart.product,
                vendorDetail: cart.vendorDetail,
                inventory: cart.inventory,
                // sellingPrice: cart.sellingPrice,
                // mrp: cart.mrp,
                vendorId: cart.vendorId,
            };
            cartProductArray.push(product);
        });
        const order: interfaces.IOrder = {
            uuid: this.cartUUID,
            totalAmount: history?.state.coupon
                ? this.history.effectiveAmount
                : this.getCartData.totalAmount,
            // totalAmount: this.getCartData.totalAmount,
            totalMrp: this.getCartData.totalMrp,
            discount: this.getCartData.discount,
            products: cartProductArray,
            applied_coupon: history?.state
                ? this.history
                : ({} as interfaces.ICoupon),
        };

        if (this.auth.currentGuestUserValue) {
            localStorage.setItem('route', '/cart');
            localStorage.setItem('guest-order', JSON.stringify(order));
            localStorage.setItem(
                'guest-route',
                '/tab/buy-now/' + Math.random()
            );
            this.router.navigateByUrl('/tab/buy-now/' + Math.random()).catch();
            return;
        }
        this.cartService.placeOrder(order).subscribe(
            res => {
                if (res) {
                    localStorage.setItem('payment-route', '/cart');
                    this.cartStateService.setCartState(this.cartBadge);
                    localStorage.removeItem('uuid');
                    localStorage.setItem('uuid', res.DATA.uuid);
                    localStorage.setItem('route', '/cart');
                    this.router
                        .navigateByUrl('/tab/buy-now/' + Math.random())
                        .catch();
                }
            },

            error => {}
        );
    }

    removeCartProduct(uuid: string): void {
        // this.presentLoading();
        this.cartService.removeCartProduct(uuid).subscribe(
            res => {
                if (res) {
                    this.toast.showToast('Product is removed', 'end').catch();
                    this.cartStateService.removeCartState(this.cartBadge--);
                    this.cartProducts = [];
                    this.getCarts();
                }
            },
            () => {
                // this.calculatePrice();
            }
        );
    }

    addAddress(): void {
        this.router.navigateByUrl('/tab/change-address/14').catch();
    }

    goback(): void {
        this.routeService.navigateToBack('ionic');
        // const route = localStorage.getItem('route');
        // if (route !== null || route !== undefined) {
        //     this.navCtrl.navigateRoot('/tab/dashboard').catch();
        // } else {
        //      this.navCtrl.back();
        // }
        // localStorage.removeItem('route');
        // localStorage.removeItem('guest-cart');
        // this.router.navigateByUrl("/dashboard");
    }

    removeCoupon(): void {
        this.loadingService.display(true);
        this.cartService.removeCoupon(this.cartUUID).subscribe(
            res => {
                if (res) {
                    this.history = undefined;
                    this.loadingService.display(false);
                    // this.getCarts();
                }
            },
            error => {
                this.loadingService.display(false);
            }
        );
    }
}
