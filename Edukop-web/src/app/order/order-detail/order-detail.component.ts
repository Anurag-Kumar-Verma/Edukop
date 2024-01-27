import { Component, OnInit } from "@angular/core";
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

@Component({
  selector: "app-order-detail",
  templateUrl: "./order-detail.component.html",
  styleUrls: ["./order-detail.component.scss"],
})
export class OrderDetailComponent implements OnInit {
  orderId!: string;
  orderDetails!: IOrder;
  vendors: IOrderProduct[] = [];
  myEnrollments: any[] = [];
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
    this.route.queryParams.subscribe((params) => {
      if (params) {
        this.orderId = JSON.parse(params?.["orderId"]);
      }
    });
    this.getUserState();
    this.orderDetail(this.orderId);
  }

  getUserState(): void {
    this.userStateService.getUserState().subscribe((val) => {
      this.getUserInfo();
    });
  }

  getUserInfo(): void {
    this.sharedService.getUserInfo().subscribe((response) => {
      this.userInfo = response.DATA;
    });
  }

  orderDetail(uuid: string) {
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

          this.checkIfDigital(this.orderDetails);
          this.calculatePrice();

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

  checkIfDigital(orderData: IOrder): void {
    this.spinner.show();
    orderData.products.filter((e) => {
      if (e.product.isDigital) {
        this.isProductDigital = true;
        this.getMyEnrollments();
      } else {
        this.isProductDigital = false;
      }
    });
    this.spinner.hide();
  }

  getMyEnrollments(): void {
    this.formService.getMyEnrollments(this.orderId).subscribe((res) => {
      this.myEnrollments = res.DATA.docs;
      this.myEnrollments.map((a, i) => {
        this.formId[i] = a.myEnrollmentId;
      });
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

  retryOrder(): void {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        orderId: JSON.stringify(this.orderId),
        isRetry: false,
        previousRoute: JSON.stringify('orderDetail')
      }
    }
    
    if (this.orderDetails.address && this.orderDetails.retryId) {
      this.router.navigate([`/side/order-status/${this.orderId}`]).catch();
    } else {
      this.router.navigate([`/buy-now`], navigationExtras);
    }
  }

  downloadInvoice(event: Event, orderUUID: string, vendorId: string){
    event.stopPropagation();
    // this.spinner.show();
    // window.open(`${environment.Api}/api/enrollGenerate?enrollmentFormId=${enrollmentFormId}&myEnrollmentId=${enrollmentId}`, '_blank')
    this.orderService.downloadInvoice(orderUUID, vendorId).subscribe(res => this.downloadFile(res))
  }

  private downloadFile(data: any){
    const blob = new Blob([data], {type: 'application/pdf'});
    const url = window.URL.createObjectURL(blob);
    window.open(url)
  }

  openForm(){
    let enrollment = this.myEnrollments[0];
    let enrollmentFormId = enrollment.enrollmentFormId;
    let enrollId = enrollment.myEnrollmentId;
    let uuid = enrollment.uuid;
    let status = enrollment.formStatus;

    let navigationExtras: NavigationExtras = {
      queryParams: {
        formId: JSON.stringify(enrollId),
        enrollId: JSON.stringify(uuid),
        formStatus: JSON.stringify(status)
      }
    }
    // this.router.navigate([`/enrollment-form/${enrollmentFormId}`], navigationExtras);
    this.router.navigate([`/side/form-list`]);
  }

  openCancelation(event: {action: string} ): void {
    this.isReturn = false;
    if(event.action == 'success'){
      this.orderDetail(this.orderId);
    }
  }

  cancelOrder() {
    this.isReturn = true;
  }
  
  back() {
    history.back();
  }
}
