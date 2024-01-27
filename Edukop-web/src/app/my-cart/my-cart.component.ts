import { Component, OnInit } from "@angular/core";
import { NavigationExtras, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { NgxUiLoaderService } from "ngx-ui-loader";
import * as interfaces from "@spundan-clients/bookz-interfaces";
import { environment } from "src/environments/environment";
import { WishlistService } from "../services/wishlist.service";
import { DashboardService } from "../services/dashboard.service";
import { AuthService } from "../auth/auth.service";
import { CartService } from "../services/cart.service";
import { CartAddProduct, CartProduct, ICart } from "../model/cart.model";
import { IProduct } from "../model/product.model";
import { CartStateService } from "../shared/states/cart.state";
import { NgxSpinnerService } from "ngx-spinner";
import { AddressService } from "../services/address.service";
import { IAddOrder } from "../model/IOrder.model";
import { MatDialog } from "@angular/material/dialog";
import { CouponComponent } from "../order/coupon/coupon.component";
import { OrderSummaryService } from "../services/orderSummaryService.service";
import { ICoupon } from "../model/ICoupon.model";
import { IBrowsingHistory } from "../dashboard/models/IBrowsingHistory.model";
import { Wishlist } from "../wishlist/model/wishlist.model";

interface Ij {
  on?: string;
}

@Component({
  selector: "app-my-cart",
  templateUrl: "./my-cart.component.html",
  styleUrls: ["./my-cart.component.scss"],
})
export class MyCartComponent implements OnInit {
  isSelectedAddress: boolean = false;

  cartBadge!: number;
  getCartData!: ICart;

  priceDetail: any;

  productList: interfaces.ICartProduct[] = [];
  cartProducts: CartProduct[] = [];
  recentProducts!: IBrowsingHistory;
  products!: IProduct;
  wishListData!: Wishlist;
  couponsDetails!: ICoupon;
  imageApi!: string;
  cartUUID!: string;
  quantity: number = 1;
  isExitCount: number = 1;
  sellingpriceSum: number = 0;
  cartState: number = 0;
  mrpSum: number = 0;
  sum: number = 0;
  default!: number;
  wishList: boolean = false;
  noData: boolean = false;
  additionalValue: string[] | number[] = ["more"];
  quantityArray: number[][] = [];
  wishlistProductIds: string[] = [];

  // for address
  defaultAddress!: interfaces.IAddress;
  addressList: interfaces.IAddress[] = [];
  thumbApi = environment.thumbApi
  

  constructor(
    public router: Router,
    private auth: AuthService,
    private loader: NgxUiLoaderService,
    public toastr: ToastrService,
    public wishlistService: WishlistService,
    public dashboardService: DashboardService,
    public cartService: CartService,
    public cartStateService: CartStateService,
    public orderSev: OrderSummaryService,
    private spinner: NgxSpinnerService,
    public dialogCtrl: MatDialog,
    private addressService: AddressService
  ) {}

  ngOnInit(): void {
    this.imageApi = environment.thumbApi;
    this.getWishList();
    this.guestAddCart();
    this.getDefaultAddress();
    this.getAddress();
  }

  getWishList() {
    this.loader.start();

    this.wishlistService.getWishList().subscribe(
      (res) => {
        if (res.DATA && res.DATA.products.length > 0) {
          this.wishListData = res.DATA;
          this.wishlistProductIds = this.wishListData.products.map(
            (e) => e.productUUID
          );
        } else {
          this.getRecentProducts();
          this.wishlistProductIds = [];
        }
        this.loader.stop();
      },
      (error) => {
        this.loader.stop();
      }
    );
  }

  guestAddCart(): void {
    const guestOrder = JSON.parse(localStorage.getItem("guest-cart") || "{}");
    this.loader.start();
    if (guestOrder && this.auth.currentGuestUserValue === undefined) {
      this.cartService.addCart(guestOrder).subscribe(
        (res) => {
          if (res) {
            localStorage.removeItem("guest-cart");
            this.cartStateService.setCartState(this.cartBadge++);
            this.getCarts();
          }
        },
        (error) => {
          this.loader.stop();
        }
      );
    } else {
      this.getCarts();
    }
  }

  getCarts(): void {
    this.cartProducts = [];
    this.loader.start();
    this.cartService.getCart().subscribe(
      (res) => {
        if (res.DATA) {
          this.getCartData = res.DATA as ICart;
          this.productList = res.DATA.products as interfaces.ICartProduct[];
          this.couponsDetails = res.DATA.applied_coupon as ICoupon;
          this.cartUUID = res.DATA.uuid as string;

          this.cartStateService.setCartState(this.productList.length);

          this.cartBadge = res.DATA.products?.length as number;
          if (res.DATA.products) {
            res.DATA.products.map((p: interfaces.ICartProduct, i: number) => {
              const cart = {
                // mrp: p.product.mrp,
                productUUID: p.productUUID,
                quantity: p.quantity,
                product: p.product,
                vendorDetail: p.vendorDetail,
                vendorProduct: p.inventory,
                vendorId: p.vendorId,
              } as CartProduct;
              this.additionalValue[i] = p.quantity;
              this.quantityArrayMethod(i);
              this.cartProducts.push(cart);
            });
          }
        }
        this.noData = true;
        this.loader.stop();
      },
      (error) => {
        this.loader.stop();
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

  onChangeQuantity(value: number | string, product: IProduct, i: number): void {
    this.cartProducts.forEach((a) => {
      if (a.productUUID === product.uuid) {
        a.quantity = Number(value);
      }
    });
    
    this.addCart("update");
  }

  productPage(product: interfaces.IProduct): void {
    this.wishList = false;
    const uuid = product.uuid;
    const d1 = "productById?uuid=" + uuid;
    this.router
      .navigateByUrl("/product-detail/" + Math.random(), {
        state: { filter: d1, type: "Product", uuid },
      })
      .catch();
    localStorage.setItem("cart-back", "/dashboard");
  }

  calculateOfferPercentage(mrp: number, sellingPrice: number): string | 0 {
    return sellingPrice > mrp
      ? 0
      : (((mrp - sellingPrice) / mrp) * 100).toFixed();
  }

  getAddress() {
    this.spinner.show();
    this.addressService.getAddress().subscribe((res: any) => {
      if(res.DATA) {
        for(let i in res.DATA) {
          this.addressList.push(res.DATA[i])
        }
        if(!this.defaultAddress && this.addressList.length != 0) {
          this.defaultAddress = this.addressList[0];
        }
        this.spinner.hide();
      }
    }, (error) => {
      this.spinner.hide();
    });
  }

  getDefaultAddress() {
    this.addressService.getDefaultAddress().subscribe(res => {
      if(res.DATA) {
        this.defaultAddress = res.DATA;
      }
    })
  }

  selectAddress() {
    this.isSelectedAddress = !this.isSelectedAddress;
  }

  editAddress(addressId: string) {
    let navigationExtra: NavigationExtras = {
      queryParams: {
        action: JSON.stringify("Update"),
        id: JSON.stringify(addressId)
      },
    };
    this.router.navigate([`/add-address`], navigationExtra);
  }

  removeAddress(uuid: string) {
    this.spinner.show();
    this.addressService.deleteAddress(uuid).subscribe(res => {
      // if(res.DATA) {
        this.addressList = [];
        this.getAddress();
        this.getDefaultAddress();
        this.toastr.success("Address Removed");
        this.spinner.hide();
      // } else {
      //   this.toastr.error("Something wrong");
      //   this.spinner.hide();
      // }
    }, (error) => {
      this.spinner.hide();
    })
  }

  selectDefaultAddress(uuid: string) {
    this.addressService.selectDefaultAddress(uuid).subscribe(res => {
      if(res.DATA) {
        this.getDefaultAddress();
      }
    })
  }

  addNewAddress() {
    let navigationExtra: NavigationExtras = {
      queryParams: {
        action: JSON.stringify("Add"),
      },
    };
    this.router.navigate([`/add-address`], navigationExtra);
  }

  addCart(action: string): void {
    this.spinner.show();
    const cartProductArray: interfaces.ICartProduct[] = [];
    let cart: interfaces.ICart;

    this.cartProducts.forEach((product) => {
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
    };

    if (this.auth.currentGuestUserValue !== undefined) {
      localStorage.setItem("guest-cart", JSON.stringify(cart));
    }

    const service =
      action === "add"
        ? this.cartService.addCart(cart)
        : this.cartService.updateCart(cart);

    service.subscribe(
      (res) => {
        if (res) {
          this.cartStateService.setCartState(this.cartBadge++);
          this.getCarts();
          this.spinner.hide();
        }
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  removeCartProduct(uuid: string): void {
    this.spinner.show();
    this.cartService.removeCartProduct(uuid).subscribe(
      (res) => {
        if (res) {
          this.toastr.success("Product is removed");
          this.cartStateService.removeCartState(this.cartBadge--);
          this.cartProducts = [];
          this.getCarts();
          this.spinner.hide();
        }
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  viewCoupons() {
    const couponDialog = this.dialogCtrl.open(CouponComponent, {
      panelClass: "couponDialog",
      minWidth: "200px",
      data: {order: this.getCartData, type: "cart", cart: this.cartProducts}
    });

    couponDialog.afterClosed().subscribe(response => {
      if(response.result) {
        this.getCartData = response.result
        this.getCarts();
      }
    });
  }

  removeCoupon() {
    this.spinner.show();
    this.cartService.removeCoupon(this.cartUUID).subscribe(
      result => {
        // this.coupon = null as any;
        this.getCarts();
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
        this.toastr.error('Something went wrong!');
      }
    );
  }

  placeOrder() {
    const cartProductArray: CartAddProduct[] = [];
    let order: IAddOrder;
    this.cartProducts.forEach(cart => {
      const product: CartAddProduct = {
        productUUID: cart.productUUID,
        quantity: cart.quantity,
        product: cart.product,
        vendorDetail: cart.vendorDetail,
        inventory: cart.inventory,
        vendorId: cart.vendorId,
      };
      cartProductArray.push(product);
    });

    order = {
      uuid: this.cartUUID,
      products: cartProductArray,
      totalAmount: this.getCartData.totalAmount,
      totalMrp: this.getCartData.totalMrp,
      discount: this.getCartData.discount as any,
      isCart: undefined as any,
      applied_coupon: this.couponsDetails ? this.couponsDetails : ({} as ICoupon)
    };

    this.cartService.placeOrder(order).subscribe((res) => {
      if(res.DATA){
        this.cartStateService.setCartState(this.cartBadge);
        let navigationExtras: NavigationExtras = {
          queryParams: {
            orderId: JSON.stringify(res.DATA.uuid),
            previousRoute: JSON.stringify('cart')
          }
        }

        localStorage.setItem("payment-route", "cart")

        this.router.navigate([`/buy-now`], navigationExtras);
      }
    });
  }

  getRecentProducts(): void {
    this.dashboardService.getRecentProducts().subscribe((res) => {
      this.recentProducts = res.DATA as IBrowsingHistory;
    });
  }

  recentlyViewedProducts(event: Event, productId: string): void {
    event.stopPropagation();

    let navigationExtras: NavigationExtras = {
      queryParams: {
        product: JSON.stringify(productId),
        filter: JSON.stringify('productById?uuid='+productId),
        type: JSON.stringify('Product'),
      },
    };

    this.router.navigate(
      [`/product-detail/${Math.random()}`],
      navigationExtras
    );
  }

  addToCart(event: Event, product: IProduct) {
    event.stopPropagation();
    this.wishList = false;
    this.cartProducts = [];

    const productDetails: interfaces.ICartProduct = {
      productUUID: product.uuid,
      quantity: 1,
      sellingPrice: product.sellingprice,
      mrp: product.mrp,
      vendorId: product.vendorId,
    };
    
    this.cartProducts.push(productDetails as any);
    this.addCart('add');
  }
}
