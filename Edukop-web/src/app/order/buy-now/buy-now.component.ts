import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription, zip } from 'rxjs';
import * as interfaces from "@spundan-clients/bookz-interfaces";
import { environment } from 'src/environments/environment';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { IAddress } from '@spundan-clients/bookz-interfaces';
import { IOrder, IOrderProduct } from 'src/app/model/IOrder.model';
import { ICoupon } from 'src/app/model/ICoupon.model';
import { AuthService } from 'src/app/auth/auth.service';
import { UserStateService } from 'src/app/shared/states/user-info.state';
import { SharedService } from 'src/app/shared/services/shared.service';
import { WishlistService } from 'src/app/services/wishlist.service';
import { AddressService } from 'src/app/services/address.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import { OrderSummaryService } from 'src/app/services/orderSummaryService.service';
import { PayService } from 'src/app/services/payService.service';
import { IProduct } from 'src/app/model/product.model';
import { CouponComponent } from '../coupon/coupon.component';
import { CartStateService } from 'src/app/shared/states/cart.state';

declare var Razorpay: any;

@Component({
  selector: 'app-buy-now',
  templateUrl: './buy-now.component.html',
  styleUrls: ['./buy-now.component.scss']
})
export class BuyNowComponent implements OnInit {
  isGuest!: boolean;
  userState!: Subscription;
  userInfo!: interfaces.IUser;
  imageApi = environment.thumbApi;
  orderId: string = '';
  isSelectedAddress: boolean = false;

  orderList!: IOrder;
  productList: IOrderProduct[] = [];
  formAsproduct!: boolean;
  additionalValue: string[] | number[] = ['more'];
  quantityArray: number[][] = [];
  selectedArray: Array<{
    mrp: number;
    sellingprice: number;
    productUUID: string;
    quantity: number;
  }> = [];
  sellingpriceSum: number = 0;
  mrpSum: number = 0;
  productSum: number = 0;
  // for address
  myAddress!: interfaces.IAddress;
  defaultAddress!: interfaces.IAddress;
  addressList: interfaces.IAddress[] = [];
  coupon!: ICoupon;
  // for payment
  razorPayData!: interfaces.IRazorpay;
  razorpayId!: string;
  razorPayStatus!: string;
  userData!: interfaces.IUser;

  gstAdd: boolean = false;
  organization: string = '';
  gstNo: string = '';

  previousRoute: string = '';

  constructor(
    public authService: AuthService,
    public toaster: ToastrService,
    private spinner: NgxSpinnerService,
    public userStateService: UserStateService,
    public sharedService: SharedService,
    public wishlistService: WishlistService,
    private addressService: AddressService,
    public dashboardService: DashboardService,
    public orderSev: OrderSummaryService,
    public payService: PayService,
    private route: ActivatedRoute,
    public cartState: CartStateService,
    public router: Router,
    public dialogCtrl: MatDialog
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if(params){
        this.orderId = JSON.parse(params?.["orderId"]);
        this.previousRoute = JSON.parse(params?.["previousRoute"]);
      }
    });
    console.log(this.previousRoute);

    if(this.orderId) {
      this.getOrderData(this.orderId);
    }
    this.getUserState();
    this.getDefaultAddress();
    this.getAddress();
  }

  getUserState(): void {
    this.userState = this.userStateService.getUserState().subscribe((val) => {
      this.getUserInfo();
      this.isGuest = this.authService.currentGuestUserValue;
    });
  }

  getUserInfo(): void {
    this.sharedService.getUserInfo().subscribe((response) => {
      this.userInfo = response.DATA;
    });
  }


  getOrderData(id: string) {
    this.getOrderById(id);
  }

  getOrderById(uuid: string) {
    this.orderSev.getOrderById(uuid).subscribe(res => {
      this.orderList = res.DATA;
      this.coupon = res.DATA?.applied_coupon === undefined ? this.coupon : res.DATA?.applied_coupon;
      if(res.DATA?.products) {
        this.productList = res.DATA.products;
        this.formAsproduct = res.DATA.products[0].product.isDigital;
      }

      if(this.productList.length > 0){
        this.productList.map((p, i: number) => {
          const cart = {
            productUUID: p.productUUID,
            quantity: p.quantity,
            mrp: p.product.mrp,
            sellingprice: p.sellingPrice
          };

          this.additionalValue[i] = p.quantity;
          this.quantityArrayMethod(i);
          this.selectedArray.push(cart);
        });
      }

      this.calculatePrice();
      if(this.orderList?.address){
        this.orderList.address = this.defaultAddress as IAddress;
      }
      this.spinner.hide();
    },
    error => {
      this.spinner.hide();
    });
  }


  calculatePrice() {
    this.mrpSum = 0;
    this.sellingpriceSum = 0;
    this.productSum = 0;
    this.selectedArray.map((a: { mrp: number; quantity: number; sellingprice: number }) => {
        this.mrpSum += a.mrp * a.quantity;
        this.sellingpriceSum += a.sellingprice * a.quantity;
      }
    );
  }

  calculateTotalAmount(quantity: number, sp: number): number {
    return sp * quantity;
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
    this.selectedArray.forEach((a: { productUUID: string; quantity: number }) => {
      if (a.productUUID === product.uuid) {
        a.quantity = Number(value);
      }
      this.payPage('');
      this.calculatePrice();
    });
  }

  payPage(action: string) {
    const isAddress = action === 'pay' ? true : false;

    if (action === 'pay') {
      if (!this.defaultAddress) {
        let navigationExtra: NavigationExtras = {
          queryParams: {
            action: JSON.stringify("Add"),
          },
        };

        this.router.navigate([`/add-address`], navigationExtra);
        return;
      }
      this.payNow();

    } else {
      let orderData = this.orderList as any;
      delete(orderData.address);
      orderData.address = this.defaultAddress.uuid;
  
      this.orderSev.addAddressOnOrder(this.orderList, isAddress).subscribe(res => {
        this.spinner.show();
  
        if(res.DATA){
          this.getOrderById(res.DATA.uuid as string);
        }
      });
    }
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
      this.addressList = [];
      this.getAddress();
      this.getDefaultAddress();
      this.toaster.success("Address Removed");
      this.spinner.hide();
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


  viewCoupons() {
    const couponDialog = this.dialogCtrl.open(CouponComponent, {
      panelClass: "couponDialog",
      minWidth: "200px",
      data: {order: this.orderList, type: "buyNow"}
    });

    couponDialog.afterClosed().subscribe(response => {
      if(response.result) {
        this.orderList = response.result
        this.getOrderById(this.orderId);
      }
    });
  }

  removeCoupon(orderUUID: string) {
    this.spinner.show();
    this.orderSev.removeCoupon(orderUUID).subscribe(
        result => {
          // this.coupon = null as any;
          this.getOrderById(orderUUID);
          this.spinner.hide();
        },
        error => {
          this.spinner.hide();
          this.toaster.error('Something went wrong!');
        }
    );
  }

  addGST() {
    this.gstAdd = !this.gstAdd;
  }
  
  addGstInfo(organizations: string, gstNos: string) {
    Object.assign(this.orderList, {
      organization: organizations,
      gstNo: gstNos,
    });

    this.toaster.success("GST Info Submited");
  }

  payNow(): void {
    const shippingAmount = this.coupon ? this.coupon.couponCode === 'FREESHIPPING' && this.coupon.couponStatus === 'SUCCESS' : false;
    
    const shippingCheck = this.orderList?.shipping_amount ? true : false;

    const params: interfaces.IOrder = {
      totalAmount: this.coupon ? (this.coupon.effectiveAmount + (shippingAmount ? 0 : shippingCheck ? this.orderList.shipping_amount : this.orderList.shipping_amount)) * 100 : (this.orderList.totalAmount + (shippingAmount ? 0 : shippingCheck ? this.orderList.shipping_amount : this.orderList.shipping_amount)) * 100, orderId: this.orderList.uuid,
    };

    this.payService.createOrder(params).subscribe(
      res => {
        if (res) {
          this.razorPayData = res.DATA;
          this.razorpayId = res.DATA.razorpayId as string;
          this.razorPayStatus = res.DATA.razorpayStatus as string;
          if (this.razorPayStatus === 'created') {
            this.payment();
          }
        }
      },
      error => {
        this.spinner.hide();
        this.toaster.error('Something went wrong!');
      }
    );
  }

  async payment(): Promise<void> {
    try {
      const options: any = {
        description: 'Payment for Edukop',
        image: 'https://s3.ap-south-1.amazonaws.com/images.bookz.in/logo/Edkop.png',
        currency: 'INR',
        key: environment.razorPayKey,
        order_id: this.razorpayId,
        amount: this.razorPayData.amount,
        name: this.userInfo.firstName ? this.userInfo.firstName + ' ' + this.userInfo.lastName : 'Guest',
        prefill: {
          name: this.userInfo.firstName + ' ' + this.userInfo.lastName || 'Guest',
          email: this.userInfo.email || '',
          contact: this.userInfo.phoneNo ? this.userInfo.phoneNo : '',
        },
        theme: {
          color: '#E03F45',
        },
      };
      
      options.handler = ((response: any, error: any) => {
        options.response = response;
        this.paymentVerify(response);
      });

      let rzp = new Razorpay(options);
      await rzp.open();

    } catch (error) {
      console.log(error)
      history.back();
    }
  }

  paymentVerify(success: {
    razorpay_order_id: string;
    razorpay_signature: string;
    razorpay_payment_id: string;
  }) {
    this.spinner.show();
    const signature = success.razorpay_signature;
    const params: interfaces.ICaptureRazorPayPayment = {
      razorpay_order_id: success.razorpay_order_id,
      razorpay_signature: success.razorpay_signature,
      razorpay_payment_id: success.razorpay_payment_id,
    };
    if (signature) {
      this.payService.capturePayment(params).subscribe(
        res => {
          this.spinner.hide();
          if (
            res['DATA'].status === interfaces.IOrderStatus.AwaitingFulfillment ||
            res['DATA'].status === interfaces.IOrderStatus.Delivered
          ) {
            this.toaster.success('Payment successful');
            if (this.previousRoute === 'cart') {
              this.cartState.setCartState(0);
            }
            localStorage.removeItem("payment-route");
            this.router.navigate([`/side/order-status/${res['DATA'].uuid}`]);
          } else {
            this.toaster.error('Payment Failed!');
            history.back();
          }
        },
        error => {
          this.spinner.hide();
          this.toaster.error('Something went wrong!');
          history.back();
        }
      );
    }
  }


}
