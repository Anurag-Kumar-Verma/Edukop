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
    selector: 'app-scrollable-square-section',
    templateUrl: './scrollable-square-section.component.html',
    styleUrls: ['./scrollable-square-section.component.scss'],
})
export class ScrollableSquareSectionPage implements OnInit, OnDestroy {
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
