import { Component, OnInit, ViewChild } from '@angular/core';
import { RouteService } from '../shared/services/router.service';
import { environment } from 'src/environments/environment';
import { SharedService } from '../shared/services/shared.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as interfaces from '@spundan-clients/bookz-interfaces';
import { IRating } from '@spundan-clients/bookz-interfaces';
import { ToastService } from '../shared/services/toast.service';
import { UUID } from 'angular2-uuid';
import { LoaderService } from '../shared/loader/loader.service';

@Component({
    selector: 'app-review',
    templateUrl: './review.page.html',
    styleUrls: ['./review.page.scss'],
})
export class ReviewPage implements OnInit {
    reviewFormGroup: FormGroup;
    orderUUID: interfaces.IOrder;
    orderData: any;
    imageUrl: string;
    rate: number;

    produtRating: interfaces.IRating;
    rateData: interfaces.IRating;
    pUUID: string;
    review: interfaces.IReview;
    reviewUUID: string;

    cmnt: string;

    constructor(
        public toaster: ToastService,
        public routeService: RouteService,
        private fb: FormBuilder,
        public sharedService: SharedService,
        public loaderService: LoaderService
    ) {}

    ngOnInit(): void {
        if (history.state.product) {
            this.orderData = [history.state.product];
        } else if (history.state.order) {
            this.orderUUID = history.state.order;
            this.orderData = this.orderUUID.products.map(e => e.product);
        }

        this.orderData.forEach((element, index) => {
            this.pUUID = element.uuid;

            this.orderData[index].uuid = this.pUUID;
            this.getRating(this.pUUID, index);
        });

        this.imageUrl = environment.imageApi;
    }
    onRateChange(event: number, index: number): void {
        this.rate = event;

        this.orderData[index].rate = event;
        this.addRateOnProduct(this.orderData[index].uuid, event);
    }

    addRateOnProduct(productUUID: string, star: number): void {
        const rateParam: IRating = {
            product_uuid: productUUID,
            stars: star,
        };
        this.sharedService.getRatingById(productUUID).subscribe(res => {
            if (res == null) {
                this.sharedService.addRating(rateParam).subscribe();
            } else {
                rateParam.uuid = res.uuid;
                this.sharedService.updateRating(rateParam).subscribe();
            }
        });
    }

    goback(): void {
        this.routeService.navigateToBack('ionic');
    }

    getRating(uuid: string, index: number): void {
        this.loaderService.display(true);
        this.sharedService.getRatingById(uuid).subscribe(res => {
            this.sharedService.getreviewById(uuid).subscribe(res1 => {
                this.orderData[index].rate = res?.stars;
                // }
                if (res1 == null) {
                    this.orderData[index].comment = null;
                } else {
                    this.cmnt = res1.comment;

                    this.orderData[index].comment = res1.comment;
                }
                this.loaderService.display(false);
            });
        });
    }

    // async getreview(uuid: string, index: number): Promise<void> {
    // if (uuid === undefined) {
    // } else {
    // this.sharedService.getreviewById(uuid).subscribe(res => {
    // if (res === null) {
    // } else {
    // this.orderData[index].comment = res.comment;
    // }
    // });
    // }
    // }

    addReview(uuid: string, comments: string): void {
        // this.sharedService.getreviewById(uuid).subscribe(res1 => {
        const revd: interfaces.IReview = {
            product_uuid: uuid,
            comment: comments,
        };
        if (this.cmnt === undefined) {
            this.sharedService.addReview(revd).subscribe(res => {
                this.toaster
                    .showToast('Review Submitted sucessfully', 'end')
                    .catch();
            });
        } else {
            // revd.uuid = res1.uuid;
            this.sharedService.updateReview(revd).subscribe(res => {
                this.toaster.showToast('Review Updated', 'end').catch();
            });
        }
        this.goback();
        // });

        // if (this.review) {
        // } else {
        // const revd: interfaces.IReview = {
        // product_uuid: uuid,
        // comment: comments,
        // };
        // this.sharedService.addReview(revd).subscribe(res => {
        // this.toaster
        // .showToast('Review Submitted sucessfully', 'end')
        // .catch();
        // });
        // }
    }
}
