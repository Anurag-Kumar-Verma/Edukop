import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import {
    FileTransfer,
    FileUploadOptions,
} from '@ionic-native/file-transfer/ngx';

import { File as ionFile } from '@ionic-native/file/ngx';
import { Platform } from '@ionic/angular';
import * as interfaces from '@spundan-clients/bookz-interfaces';

import { environment } from '../../environments/environment';
import { AuthService } from '../auth/services/auth.service';
import { OrderSummaryService } from '../buy-now/services/order-summary.service';
import { DynamicFormService } from '../dynamic-form/services/dynamic-forms.service';
import { LoaderService } from '../shared/loader/loader.service';
import { ReturnService } from '../shared/services/return.service';
import { RouteService } from '../shared/services/router.service';
import { ToastService } from '../shared/services/toast.service';

import { OrderService } from './service/order.service';
@Component({
    selector: 'app-my-order-details',
    templateUrl: './my-order-details.page.html',
    styleUrls: ['./my-order-details.page.scss'],
})
export class MyOrderDetailsPage implements OnInit {
    isLoading: boolean;
    orderData: interfaces.IOrder;
    orderDetails: interfaces.IOrderProduct[] = [];
    imageUrl: string;
    myAddress: any;
    totalAmount: number;
    isDataLoaded: boolean = false;
    mrpSum: number;
    sellingpriceSum: number;
    isReturn: boolean;
    enableBackdropDismiss: boolean;
    showBackdrop: boolean;
    shouldPropagate: boolean;
    onReturnFormGroup: FormGroup;
    reason: string[] = [
        'Received a wrong or defective product',
        'Image shown did not match the actual product',
        'Quality Issues',
        'I changed my mind',
    ];
    shippingDetails: interfaces.IShipping;
    orderUUID: string;
    isProductDigital: boolean = false;
    myEnrollments: any[] = [];
    formId: string[] = [];
    vendors: interfaces.IOrderProduct[];
    constructor(
        private orderService: OrderSummaryService,
        private loadingService: LoaderService,
        private router: Router,
        public platform: Platform,
        public fb: FormBuilder,
        public returnService: ReturnService,
        public toast: ToastService,
        public orderDetailService: OrderService,
        private fileOpener: FileOpener,
        private file: ionFile,
        public routeService: RouteService,
        private formService: DynamicFormService,
        public authService: AuthService
    ) {
        // this.router.events.pipe(
        //   filter(event => event instanceof NavigationStart)
        // ).subscribe((route: NavigationStart) => {
        //   this.ionViewWillEnter();
        // })
    }

    ngOnInit(): void {
        if(!history.state.order) {
            history.back();
        }
        this.orderDetails = [];
        this.orderUUID = history.state.order;
        this.getOrderDetails(this.orderUUID);
    }

    ionViewWillEnter(): void {
        // this.loadingService.loadingDismiss();
    }

    async ionViewWillLeave() {
        this.isReturn = false;
    }

    onReset(): void {
        this.orderDetails = [];
    }

    getOrderDetails(orderUUID: string): void {
        this.loadingService.display(true);
        this.orderService.getOrderById(orderUUID).subscribe(
            res => {
                if(res.DATA){
                    this.isDataLoaded = true;
                    this.orderData = res.DATA;
                    if (this.orderData && this.orderData?.shippingId !== null) {
                        this.getShippingDetails(this.orderData.shippingId);
                    }
                    this.vendors = res.DATA.products.filter(
                        (thing, i, arr) =>
                            arr.findIndex(t => t.vendorId === thing.vendorId) === i
                    );

                    this.totalAmount = res.DATA.totalAmount;
                    this.myAddress = res.DATA.address;
                    this.imageUrl = environment.thumbApi;
                    res.DATA.products.forEach(e => {
                        this.orderDetails.push(e);
                    });
                    this.checkIfDigital(this.orderData);
                    this.calculatePrice();
                }
                this.loadingService.display(false);
            },
            error => {
                this.loadingService.display(false);
                this.isDataLoaded = true;
            }
        );
    }

    getProduct(vendorId: string): any[] {
        return this.orderData.products.filter(a => a.vendorId === vendorId);
    }

    goback(): void {
        this.isReturn = false;
        this.routeService.navigateToBack('ionic');
    }

    getShippingDetails(id: string): void {
        this.orderDetailService.getShippingDetails(id).subscribe(res => {
            this.shippingDetails = res.DATA;
        });
    }

    calculatePrice(): void {
        this.mrpSum = 0;
        this.sellingpriceSum = 0;
        this.orderDetails.map(a => {
            this.mrpSum += a.product.mrp * a.quantity;
            this.sellingpriceSum += a.product.sellingprice * a.quantity;
        });
    }

    calculateOfferPercentage(
        mrp: number,
        sellingPrice: number
    ): string | number {
        return sellingPrice > mrp
            ? 0
            : (((mrp - sellingPrice) / mrp) * 100).toFixed();
    }

    createFormGroup(): void {
        this.onReturnFormGroup = this.fb.group({
            reason: ['', Validators.required],
            additionalComment: [''],
            isConfirmed: [true, Validators.required],
        });
    }

    isChecked(reason: string): boolean {
        const selectedReason = this.onReturnFormGroup.controls.reason.value;
        if (reason === selectedReason) {
            return true;
        }
    }

    downloadInvoice(orderData: interfaces.IOrderProduct): void {
        this.loadingService.display(true);
        let fileName = 'file.pdf';
        const filePath = this.file.dataDirectory + fileName;
        // for iOS use this.file.documentsDirectory
        const url =
            environment.Api +
            `/api/invoiceGenerate?uuid=${this.orderData.uuid}&vendorId=${orderData.vendorId}`;
        const fileTransfer = new FileTransfer().create();

        let options: FileUploadOptions = {
        headers: {
          "authtoken": this.authService.currentUserValue
        },
      }
        fileTransfer
            .download(
                url,
                this.file.externalRootDirectory +
        '/Download/Edukop/' + 'file.pdf',
                true, options
            )
            .then(
                entry => {
                    console.log(entry,'entry')
                    this.loadingService.display(false);
                    this.fileOpener
                        .open(this.file.externalRootDirectory + '/Download/Edukop/' + 'file.pdf', 'application/pdf')
                        // tslint:disable-next-line: no-console
                        .then(() => console.log('File is opened'))
                        // tslint:disable-next-line: no-console
                        .catch(e => console.log('Error opening file', e));
                },
                error => {
                    this.loadingService.display(false);
                }
            );
    }

    radioSelect(event: string): void {
        this.onReturnFormGroup.patchValue({
            reason: event,
        });
    }

    onReturn(): void {
        this.createFormGroup();
        this.isReturn = true;
        // this.enableBackdropDismiss = true;
        // this.showBackdrop = true;
        // this.shouldPropagate = true;
    }

    close(): void {
        this.isReturn = false;
    }

    returnSubmit(): void {
        if (
            !this.onReturnFormGroup.value.reason ||
            !this.onReturnFormGroup.value.isConfirmed
        ) {
            this.toast.showToast(
                'Please select reason and click on checkbox',
                'end'
            );
            this.onReturnFormGroup.reset();
            return;
        } else {
            this.loadingService.display(true);
            const formValue = this.onReturnFormGroup.controls;
            const data: interfaces.IReturn = {} as interfaces.IReturn;
            data.orderId = this.orderData.orderId;
            data.uuid = this.orderData.uuid;
            data.paymentId = this.orderData.paymentId;
            data.reason = formValue.reason.value;
            data.userId = this.orderData.uuid;
            data.status = this.orderData.status;
            this.returnService.requestReturn(data).subscribe(
                res => {
                    this.loadingService.display(false);
                    if (res) {
                        this.toast
                            .showToast('Return request success', 'end')
                            .catch();
                        this.onReset();
                        this.getOrderDetails(this.orderUUID);
                        this.isReturn = false;
                    }
                },
                error => {
                    this.toast.showToast(error, 'end').catch();
                }
            );
        }
    }

    cancelOrder(): void {
        this.loadingService.display(true);
        const formValue = this.onReturnFormGroup.controls;
        const data: interfaces.IReturn = {} as interfaces.IReturn;
        data.orderId = this.orderData.orderId;
        data.uuid = this.orderData.uuid;
        data.paymentId = this.orderData.paymentId;
        data.reason = formValue.reason.value;
        data.userId = this.orderData.uuid;
        data.status = this.orderData.status;
        this.returnService.requestCancel(data).subscribe(
            res => {
                this.loadingService.display(false);
                if (res) {
                    this.toast
                        .showToast('Cancel request success', 'end')
                        .catch();
                    this.onReset();
                    this.getOrderDetails(this.orderUUID);
                    this.isReturn = false;
                }
            },
            error => {
                this.toast.showToast(error, 'end').catch();
            }
        );
    }
    onRetry(): void {
        if (this.orderData.address && this.orderData.retryId) {
            this.router
                .navigateByUrl('/tab/order-placed/' + Math.random(), {
                    state: {
                        order: this.orderData,
                        isRetry: true,
                    },
                })
                .catch();
        } else {
            localStorage.setItem('uuid', this.orderData.uuid);
            this.router.navigateByUrl('/tab/buy-now/' + Math.random()).catch();
        }
    }

    checkIfDigital(orderData: interfaces.IOrder): void {
        orderData.products.filter(e => {
            if (e.product.isDigital) {
                this.isProductDigital = true;
                this.getMyEnrollments();
            } else {
                this.isProductDigital = false;
            }
        });
        this.loadingService.display(false);
    }

    getMyEnrollments(): void {
        this.formService.getMyEnrollments(this.orderUUID).subscribe(res => {
            this.myEnrollments = res.DATA.docs;
            this.myEnrollments.map((a, i) => {
                this.formId[i] = a.myEnrollmentId;
            });
        });
    }

    openForm(): void {
        this.router.navigateByUrl('/tab/dynamic-form/' + Math.random(), {
            state: {
                enrollmentId: this.myEnrollments[0],
            },
        });
    }

    showForms(): void {
        this.router.navigateByUrl('/tab/form-list/' + Math.random(), {
            state: {
                myEnrollments: this.myEnrollments,
            },
        });
    }
}
