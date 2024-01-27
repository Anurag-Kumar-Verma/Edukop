import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { IOrder, IOrderProduct } from "src/app/model/IOrder.model";
import { OrderSummaryService } from "src/app/services/orderSummaryService.service";
import { UserStateService } from "src/app/shared/states/user-info.state";
import * as interfaces from "@spundan-clients/bookz-interfaces";
import { DynamicFormService } from "src/app/services/dynamicFormService.service";
import { environment } from "src/environments/environment";
import { ToastrService } from "ngx-toastr";
import { SharedService } from "src/app/shared/services/shared.service";
import { PayService } from "src/app/services/payService.service";

declare var Razorpay: any;

@Component({
  selector: 'app-order-status',
  templateUrl: './order-status.component.html',
  styleUrls: ['./order-status.component.scss']
})
export class OrderStatusComponent implements OnInit {
  orderId!: string;
  orderDetails!: IOrder;
  vendors: IOrderProduct[] = [];
  formId: string[] = [];
  shippingDetails!: interfaces.IShipping;
  isProductDigital: boolean = false;
  isReturn: boolean = false;
  mrpSum!: number;
  sellingpriceSum!: number;
  imageUrl = environment.thumbApi;
  userInfo!: interfaces.IUser;
  razorpayId: string = '';
  razorPayStatus!: string;

  constructor(
    public router: Router,
    public userStateService: UserStateService,
    public orderService: OrderSummaryService,
    private spinner: NgxSpinnerService,
    public formService: DynamicFormService,
    private route: ActivatedRoute,
    public toaster: ToastrService,
    public sharedService: SharedService,
    private payService: PayService,
  ) {}

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id') as string;
    this.getUserInfo();
    this.getOrderDetail(this.orderId);
  }

  getUserInfo() {
    this.sharedService.getUserInfo().subscribe((response) => {
      this.userInfo = response.DATA;
    });
  }

  getOrderDetail(uuid: string) {
    this.spinner.show();
    this.orderService.getOrderById(uuid).subscribe(
      (res) => {
        if (res.DATA) {
          this.orderDetails = res.DATA as IOrder;

          if (this.orderDetails?.shippingId !== null) {
            this.getShippingDetails(this.orderDetails.shippingId);
          }
          this.vendors = res.DATA.products.filter(
            (thing, i, arr) =>
              arr.findIndex((t) => t.vendorId === thing.vendorId) === i
          );

          this.calculatePrice();

          if(this.orderDetails.retryId && this.orderDetails.status === 'Pending') {
            this.retry();
          }

          this.spinner.hide();
        }
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  getShippingDetails(id: string): void {
    this.orderService.getShippingDetails(id).subscribe((res) => {
      this.shippingDetails = res.DATA;
    });
  }

  calculatePrice(): void {
    this.mrpSum = 0;
    this.sellingpriceSum = 0;
    this.orderDetails.products.map((a) => {
      this.mrpSum += a.product.mrp * a.quantity;
      this.sellingpriceSum += a.product.sellingprice * a.quantity;
    });
  }

  calculateOfferPercentage(mrp: number, sellingPrice: number): string | number {
    return sellingPrice > mrp
      ? 0
      : (((mrp - sellingPrice) / mrp) * 100).toFixed();
  }

  getProduct(vendorId: string): any[] {
    return this.orderDetails.products.filter((a) => a.vendorId === vendorId);
  }

  retry(){
    this.razorpayId = this.orderDetails.retryId as string;
    this.razorPayStatus = this.orderDetails.status;
    this.payment();
  }

  async payment(): Promise<void> {
    try {
      const options: any = {
        description: 'Payment for Edukop',
        image: 'https://s3.ap-south-1.amazonaws.com/images.bookz.in/logo/Edkop.png',
        currency: 'INR',
        amount: this.orderDetails.totalAmount,
        key: environment.razorPayKey,
        order_id: this.razorpayId,
        name: this.userInfo.firstName
          ? this.userInfo.firstName + ' ' + this.userInfo.lastName
          : 'Guest',
        prefill: {
          name: this.userInfo.firstName + ' ' + this.userInfo.lastName || 'Guest',
          email: this.userInfo.email || '',
          contact: this.userInfo.phoneNo ? this.userInfo.phoneNo : '',
        },
        theme: {
          color: '#E03F45',
        }
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
          console.log(res);
          if (
            res['DATA'].status === interfaces.IOrderStatus.AwaitingFulfillment ||
            res['DATA'].status === interfaces.IOrderStatus.Delivered
          ) {
            this.toaster.success('Payment successful');
            window.location.reload();
          } else {
          this.toaster.error('Payment Failed!');
          }
        },
        error => {
          this.spinner.hide();
          this.toaster.error('Something went wrong!');
          console.log(error)
        }
      );
    }
    this.spinner.hide();
  }

  openCancelation(event: {action: string} ): void {
    this.isReturn = false;
    if(event.action == 'success'){
      this.getOrderDetail(this.orderId);
    }
  }

  trackOrder(){
    let navigationExtras: NavigationExtras = {
      queryParams: {
        orderId: JSON.stringify(this.orderId)
      }
    };

    this.router.navigate([`/side/order-detail`], navigationExtras)
  }

  cancelOrder() {
    this.isReturn = true;
  }

}
