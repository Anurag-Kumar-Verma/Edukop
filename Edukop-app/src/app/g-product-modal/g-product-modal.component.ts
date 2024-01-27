import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import * as interfaces from '@spundan-clients/bookz-interfaces';

import { SharedService } from '../shared/services/shared.service';
@Component({
    selector: 'app-g-product-modal',
    templateUrl: './g-product-modal.component.html',
    styleUrls: ['./g-product-modal.component.scss'],
})
export class GProductModalComponent implements OnInit {
    event: interfaces.IGroupProduct;
    productData: interfaces.IProduct;
    isLoading: boolean = true;
    constructor(
        private sharedService: SharedService,
        private popoverController: PopoverController
    ) {}

    ngOnInit(): void {
        this.getproducts();
    }

    calculateOfferPercentage(mrp: number, sellingPrice: number): string | 0 {
        return sellingPrice > mrp
            ? 0
            : (((mrp - sellingPrice) / mrp) * 100).toFixed();
    }

    dismiss(): void {
        this.popoverController
            .dismiss({
                dismissed: true,
            })
            .catch();
    }

    getproducts(): void {
        this.sharedService
            .getProductByIds(this.event.products.map(e => e.uuid))
            .subscribe(res => {
                this.isLoading = false;
                this.productData = res.DATA.docs;
            });
    }
}
