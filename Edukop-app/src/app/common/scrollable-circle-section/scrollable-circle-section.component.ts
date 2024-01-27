import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { Router } from '@angular/router';
import * as interfaces from '@spundan-clients/bookz-interfaces';
import { TopCategories } from 'src/app/dashboard/models/category.model';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-scrollable-circle-section',
    templateUrl: './scrollable-circle-section.component.html',
    styleUrls: ['./scrollable-circle-section.component.scss'],
})
export class ScrollableCircleSectionPage implements OnInit, OnDestroy {
    @Input() section: interfaces.ICollection;
    @Output() openCategoryEmit: EventEmitter<{
        category: any;
    }> = new EventEmitter();
    imageApi: string;
    thumbApi: string;
    constructor(public router: Router) {
        this.imageApi = environment.imageApi;
        this.thumbApi = environment.thumbApi;
        // this.ionViewWillEnter();
    }
    ngOnInit(): void {
        this.imageApi = environment.imageApi;
        this.thumbApi = environment.thumbApi;
    }
    ngOnDestroy(): void {}

    openCategory(category: any): void {
        this.openCategoryEmit.emit({
            category: {
                filter: category.action,
                type: category.orgType,
                routerLink: category.routerLink,
                uuid: category.category_uuid ? category.category_uuid : category._id,
            },
        });
    }

    openAllCategory(): void {
        this.router.navigateByUrl('/tab/all-categories').catch();
    }
    // openSectionProduct(action: string, typo: string, uuid: string,name: string) {
    //     this.openSectionProductEmit.emit({
    //         action: action,
    //         typo: typo,
    //         uuid: uuid,
    //         name: name
    //     })
    // }
}
