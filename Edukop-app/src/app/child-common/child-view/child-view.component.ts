import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import * as interfaces from '@spundan-clients/bookz-interfaces';
import { IStandard, ICourse } from '@spundan-clients/bookz-interfaces';
import { environment } from 'src/environments/environment';
export interface IChildCategories {
    type: string;
    list: interfaces.IStandard[] | interfaces.ICourse[];
}

@Component({
    selector: 'app-child-view-section',
    templateUrl: './child-view.component.html',
    styleUrls: ['./child-view.component.scss'],
})
export class ChildViewPage implements OnInit, OnDestroy {
    @Input() ChildData: IChildCategories;
    @Output() productPageEmit: EventEmitter<{
        ChildData: IStandard;
    }> = new EventEmitter();
    imageApi: string;
    imageEnvUrl: string;
    thumbApi: string;
    ngOnInit(): void {
        this.imageEnvUrl = environment.thumbApi;
        this.imageApi = environment.imageApi;
        this.thumbApi = environment.thumbApi;
    }

    ngOnDestroy(): void {}
    productPage(ChildData: IStandard): void {
        this.productPageEmit.emit({
            ChildData,
        });
    }
}
