import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { OrderSummaryService } from 'src/app/services/orderSummaryService.service';
import * as interfaces from "@spundan-clients/bookz-interfaces";
import { IOrder } from 'src/app/model/IOrder.model';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'app-order-cancelation',
  templateUrl: './order-cancelation.component.html',
  styleUrls: ['./order-cancelation.component.scss']
})
export class OrderCancelationComponent implements OnInit {
  @Input() orderDetails!: IOrder;
  @Output() cancelOrder: EventEmitter<{action: string}> = new EventEmitter();

  onReturnFormGroup!: FormGroup;
  reason: string[] = [
    'Received a wrong or defective product',
    'Image shown did not match the actual product',
    'Quality Issues',
    'I changed my mind',
  ];

  constructor(
    public orderService: OrderSummaryService,
    private spinner: NgxSpinnerService,
    public toaster: ToastrService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.createFormGroup();
  }

  createFormGroup(): void {
    this.onReturnFormGroup = this.fb.group({
      reason: ['', Validators.required],
      additionalComment: [''],
      isConfirmed: [true, Validators.required],
    });
  }

  isChecked(reason: string): boolean {
    const selectedReason = this.onReturnFormGroup.controls['reason'].value;
    if (reason === selectedReason) {
        return true;
    } else {
      return false;
    }
  }

  // selectReason(event: MatRadioChange): void {
    // this.onReturnFormGroup.patchValue({
    //   reason: event,
    // });
  // }

  close(action: string){
    this.cancelOrder.emit({action: action});
  }


  orderCancel() {
    const formValue = this.onReturnFormGroup.controls;
    const data: interfaces.IReturn = {} as interfaces.IReturn;
    data.orderId = this.orderDetails.orderId;
    data.uuid = this.orderDetails.uuid;
    data.paymentId = this.orderDetails.paymentId as string;
    data.reason = formValue['reason'].value;
    data.userId = localStorage.getItem('uuid') as string;
    data.status = this.orderDetails.status;
    this.spinner.show();

    this.orderService.requestCancel(data).subscribe(
      res => {
        if (res) {
          this.toaster.success('Cancel request success');
          this.onReturnFormGroup.reset();
          this.cancelOrder.emit({action: 'success'});
          this.spinner.hide();
        }
      },
      error => {
        this.toaster.error(error);
        this.spinner.hide();
      }
    );
  }

}
