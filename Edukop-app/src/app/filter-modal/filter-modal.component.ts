import { Component, NgZone, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { IonCheckbox, ModalController, NavController } from '@ionic/angular';
import * as interfaces from '@spundan-clients/bookz-interfaces';

import { ClassCategory } from '../child-category/model/child-category.model';
import { DynamicFormService } from '../dynamic-form/services/dynamic-forms.service';
import { SharedService } from '../shared/services/shared.service';
export interface Range {
    lower?: number;
    upper?: number;
}
@Component({
    selector: 'app-filter-modal',
    templateUrl: './filter-modal.component.html',
    styleUrls: ['./filter-modal.component.scss'],
})
export class FilterModalComponent implements OnInit {
    categoryFilter: interfaces.IAttribute[];
    Filter: string[];
    price: boolean;
    searchData: ClassCategory;
    categoryUUID: string;
    attributeValue: interfaces.IAttributeValues[];
    selectedFilter: string[] = [];
    filterBadge: number[] = [];
    isClicked: boolean[] = [false];
    pageNumber: number = 0;
    pageLimit: number = 10;
    priceRange: boolean = false;
    knobValues: Range = {
        lower: 0,
        upper: 0,
    };
    isRange: boolean;
    constructor(
        public router: Router,
        public modalController: ModalController,
        private navCtrl: NavController,
        public sharedService: SharedService,
        public dynamicService: DynamicFormService,
        private zone: NgZone
    ) {}

    ngOnInit(): void {
        this.knobValues.lower = this.searchData ? this.searchData.min : 0;
        this.knobValues.upper = this.searchData ? this.searchData.max : 1000;
        this.categoryFilter = this.categoryFilter.filter(
            e => e.attributeValues && e.attributeValues.length > 0
        );

        this.price = true;
        this.attributeValue = this.categoryFilter[0]?.attributeValues;
        if (this.Filter) {
            this.selectedFilter = this.Filter;
        }
    }

    dismiss(): void {
        this.modalController
            .dismiss({
                dismissed: true,
                filter: [],
            })
            .catch();
    }

    showAttributeValues(attribute: interfaces.IAttribute, i: number): void {
        this.isRange = false
        this.isClicked = [false];
        this.attributeValue = attribute.attributeValues;
        this.isClicked[i] = true;
        //    this.attribute
    }

    showRange(){
        this.attributeValue = [];
        this.isRange = true;
        this.isClicked = [false];
    }

    selectedAttribute(
        event: any,
        attribute: interfaces.IAttributeValues
    ): void {
        if (event.detail.checked == true) {
            this.selectedFilter.push(attribute.attributeValue);
        } else {
            const index = this.selectedFilter.findIndex(p => {
                return p === attribute.attributeValue;
            });

            this.selectedFilter.splice(index, 1);
        }
    }

    isChecked(attribute: interfaces.IAttributeValues, index: number): boolean {
        return this.selectedFilter.some(
            val => val === attribute.attributeValue
        );
    }

    applyFilter(): void {
        // if (this.selectedFilter.length !== 0 || this.priceRange) {
        //     this.search();
        // } else {
            if(this.selectedFilter.length < 1 && (!this.knobValues.lower && !this.knobValues.upper)) {
                const data = {
                    dismissed: true
                };
                this.modalController.dismiss(data).catch
            } else {
            const data = {
                // product: [],
                filter: this.selectedFilter,
                dismissed: false,
                min: this.knobValues.lower,
                max: this.knobValues.upper,
            };
            this.modalController.dismiss(data).catch();
        }
        // }
    }

    onClearFilter(): void {
        this.selectedFilter = [];
        this.knobValues.lower = this.searchData?.min;
        this.knobValues.upper = this.searchData?.max;
    }

    search(): void {
        let searchData;
        const paginate: interfaces.IPaginate = {
            pageIndex: this.pageNumber + 1,
            pageSize: this.pageLimit,
        };
        // if (this.selectedFilter.length) {
        searchData = {
            min: this.knobValues.lower,
            max: this.knobValues.upper,
            attribute_value: this.selectedFilter,
            uuid: this.searchData?.uuid,
            sub_uuid: this.searchData?.sub_uuid,
            category_uuid: this.categoryUUID,
            sort: 1,
        };
        this.sharedService.search(searchData, paginate).subscribe(response => {
            const data = {
                min: this.knobValues.lower,
                max: this.knobValues.upper,
                product: response.DATA,
                filter: this.selectedFilter,
                dismissed: false,
            };
            this.modalController.dismiss(data).catch();
        });
        /// }
        // else {
        //     const data = {
        //         product: [],
        //         filter: this.selectedFilter,
        //     };
        //     this.modalController.dismiss(data).catch();
        // }
        this.pageNumber = 0;
    }

    onPriceChange(event: any): void {
        this.priceRange = true;
        this.zone.run(() => {
            this.knobValues.lower = event.detail.value.lower;
            this.knobValues.upper = event.detail.value.upper;
        });
    }
}
