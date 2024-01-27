import { Component, OnInit } from '@angular/core';

import { LoaderService } from './loader.service';

@Component({
    selector: 'app-loader',
    template: ` <div class="loading" *ngIf="showLoader"></div> `,
    styleUrls: ['./loader.component.css'],
})
export class LoaderComponent implements OnInit {
    showLoader: boolean = false;

    constructor(private loaderService: LoaderService) {}

    ngOnInit(): void {
        this.loaderService.status.subscribe((val: boolean) => {
            this.showLoader = val;
        });
    }
}
