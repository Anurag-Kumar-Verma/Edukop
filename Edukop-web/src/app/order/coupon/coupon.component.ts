import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICart, ICartProduct, IPaginate } from '@spundan-clients/bookz-interfaces';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthGuard } from 'src/app/auth/auth-gaurd.service';
import { CartProduct } from 'src/app/model/cart.model';
import { ICoupon } from 'src/app/model/ICoupon.model';
import { IOrder } from 'src/app/model/IOrder.model';
import { CartService } from 'src/app/services/cart.service';
import { SharedService } from 'src/app/shared/services/shared.service';

export interface DialogData {
  order: ICart | IOrder,
  type: string,
  cart: CartProduct[]
}

@Component({
  selector: 'app-coupon',
  templateUrl: './coupon.component.html',
  styleUrls: ['./coupon.component.scss'],
  providers: [AuthGuard]
})
export class CouponComponent implements OnInit {
  pageNumber: number = 1;
  pageLimit: number = 10;
  orderData!: ICart;
  couponCode: string = '';
  couponData!: ICart;
  couponResponse!: ICoupon;
  apply: boolean = false;
  error: boolean = false;
  type!: string;
  allCoupons: any;
  couponApplied: any;
  cartProducts: ICartProduct[] = [];

  constructor(
    public sharedService: SharedService,
    public cartService: CartService,
    public toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private dialogRef: MatDialogRef<CouponComponent>,
    @Inject(MAT_DIALOG_DATA) private data: DialogData
  ) { }

  ngOnInit(): void {
    this.getCoupon();
    this.couponData = this.data.order;
    this.type = this.data.type;
    this.cartProducts = this.data.cart
  }

  getCoupon() {
    const paginate: IPaginate = {
      pageIndex: this.pageNumber,
      pageSize: this.pageLimit,
    };

    this.spinner.show();
    this.sharedService.getCouponsByPagination(paginate).subscribe(res => {
      this.allCoupons = res.DATA.docs;
      this.spinner.hide();
    });
  }

  applyCoupon(couponCode: string) {
    this.spinner.show();
    this.cartService.applyCoupon(this.couponData, couponCode).subscribe(
      res => {
        if (res.DATA) {
          this.orderData = res.DATA;
          this.couponResponse = res.DATA.applied_coupon;
          this.couponApplied = res.DATA.applied_coupon.couponStatus;
          
          if (this.couponApplied === 'SUCCESS') {
            this.couponCode = couponCode;
            this.apply = true;
            this.toastr.success('Coupon applied');
          } else {
            this.apply = false;
            this.toastr.error(res.DATA.applied_coupon.reason,);
          }
          this.spinner.hide();
        } else {
          this.error = true;
          this.toastr.error(res.MESSAGE);
          this.toastr.error('This Coupon is not valid');
          this.spinner.hide();
        }
      },
      error => {
        this.error = true;
        this.toastr.error('This Coupon is not valid');
        this.spinner.hide();
      }
    );
  }

  selectCoupon(code: string) {
    this.applyCoupon(code);
  }

  getDiscountAmount() {
    if (this.couponResponse && this.couponResponse.couponStatus === 'SUCCESS') {
      if (this.couponResponse.is_shipping_discount) {
        return Math.abs(this.couponResponse.shippingFree);
      } else {
        return Math.abs(this.couponResponse.couponDiscount);
      }
    } else {
      return 0;
    }
  }

  updateOrder() {
    if (this.couponApplied !== 'SUCCESS') {
      return;
    }
    
    const order: any = this.couponData;
    
    Object.assign(this.couponData, { applied_coupon: this.couponResponse });

    this.spinner.show();
    this.cartService.placeOrder(order).subscribe(
      res => {
        if(res){
          this.dialogRef.close({result: res.DATA});
        }
        this.spinner.hide();
      },
      error => { 
        this.spinner.hide();
      }
    );
  }

  updateCart() {
    if (this.couponApplied !== 'SUCCESS') {
      return;
    }
    
    const cartProductArray: ICartProduct[] = [];
    let cart: ICart;
    
    this.cartProducts.forEach(product => {
      const prodt: ICartProduct = {
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
    };

    this.spinner.show();

    this.cartService.updateCart(cart).subscribe(
      res => {
        if(res) {
          this.dialogRef.close({result: res.DATA});
        }
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  close() {
    this.dialogRef.close();
  }

  continue() {
    this.type === "buyNow" ? this.updateOrder() : this.updateCart();
  }

}
