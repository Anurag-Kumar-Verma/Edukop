import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import * as interfaces from '@spundan-clients/bookz-interfaces';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-single-image',
    templateUrl: './single-image.component.html',
    styleUrls: ['./single-image.component.scss'],
})
export class SingleImageSectionPage implements OnInit, OnDestroy {
    @Input() section: any;
    @Output() openSectionProductEmit: EventEmitter<{
        action: string;
        typo: string;
        uuid: string;
        name: string;
        isRouterLink?:boolean;
        routerLink?:string;
        orgType?: string;
    }> = new EventEmitter();
    imageApi: string;
    thumbApi: string;
    ngOnInit(): void {
        this.imageApi = environment.imageApi;
        this.thumbApi = environment.thumbApi;
    }
    ngOnDestroy(): void {}
    openSectionProduct(
        action: string,
        typo: string,
        uuid: string,
        name: string,
        isRouterLink?: boolean,
        routerLink?:string,
        orgType?:string,
    ): void {
        this.openSectionProductEmit.emit({
            action,
            typo,
            uuid,
            name,
            isRouterLink,
            routerLink,
            orgType
        });
    }
}
