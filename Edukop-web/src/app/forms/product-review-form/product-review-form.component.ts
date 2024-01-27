import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { IReview } from "@spundan-clients/bookz-interfaces";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { IRating } from "src/app/model/IRating.model";
import { IProduct } from "src/app/model/product.model";
import { SharedService } from "src/app/shared/services/shared.service";
import { environment } from "src/environments/environment";

export interface ModalData {
  product: IProduct;
}

@Component({
  selector: "app-product-review-form",
  templateUrl: "./product-review-form.component.html",
  styleUrls: ["./product-review-form.component.scss"],
})
export class ProductReviewFormComponent implements OnInit {
  rate: number = 0;
  message = "";
  productDetail!: IProduct;
  imageApi = environment.imageApi;
  comment: any;

  constructor(
    public sharedService: SharedService,
    private dialogRef: MatDialogRef<ProductReviewFormComponent>,
    public toaster: ToastrService,
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: ModalData
  ) {}

  ngOnInit(): void {
    this.productDetail = this.data.product;
    this.getRating(this.productDetail.uuid);
    this.getReview(this.productDetail.uuid);
  }

  onRateChange(event: number) {
    this.rate = event;
    this.addRateOnProduct(this.productDetail.uuid, event);
  }

  getRating(uuid: string): void {
    this.spinner.show();
    this.sharedService.getRatingById(uuid).subscribe((res) => {
      this.rate = res?.stars;
    });
  }

  getReview(uuid: string) {
    this.sharedService.getreviewById(uuid).subscribe((res1) => {
      if (res1 == null) {
        this.comment = null;
        this.message = '';
      } else {
        this.message = res1.comment;

        this.comment = res1.comment;
      }
      this.spinner.hide();
    });
  }

  addRateOnProduct(productUUID: string, star: number): void {
    const rateParam: IRating = {
      product_uuid: productUUID,
      stars: star,
    };

    this.sharedService.getRatingById(productUUID).subscribe((res) => {
      if (res == null) {
        this.sharedService.addRating(rateParam).subscribe();
      } else {
        rateParam.uuid = res.uuid;
        this.sharedService.updateRating(rateParam).subscribe();
      }
    });
  }

  submit() {
    console.log(this.message);
    const data: IReview = {
      product_uuid: this.productDetail.uuid,
      comment: this.message,
    };

    this.spinner.hide();
    if (!this.comment) {
      this.sharedService.addReview(data).subscribe(
        (res) => {
          if (res) {
            this.toaster.success("Review Submitted Successfully.");
            this.toaster.success("Thanks for giving review.");
            this.dialogRef.close({status: "success"});
            this.spinner.hide();
          }
        },
        (error) => {
          this.spinner.hide();
        }
      );
    } else {
      this.sharedService.updateReview(data).subscribe(
        (res) => {
          if (res) {
            this.toaster.success("Review Updated Successfully.");
            this.dialogRef.close({status: "success"});
            this.spinner.hide();
          }
        },
        (error) => {
          this.spinner.hide();
        }
      );
    }
  }
  
  close() {
    this.dialogRef.close({status: "cancel"});
  }
}
