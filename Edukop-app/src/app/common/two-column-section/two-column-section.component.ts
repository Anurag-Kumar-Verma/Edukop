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
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-two-column-section',
    templateUrl: './two-column-section.component.html',
    styleUrls: ['./two-column-section.component.scss'],
})
export class TwoColumnSectionPage implements OnInit, OnDestroy {
    constructor(public router: Router) { }

    @Input() section: any;
    @Output() openSectionProductEmit: EventEmitter<{
        action: string;
        typo: string;
        uuid: string;
        name: string;
        isRouterLink?: boolean;
        routerLink?: string;
        orgType?: string;
    }> = new EventEmitter();
    imageApi: string;
    thumbApi: string;
    ngOnInit(): void {
        this.imageApi = environment.imageApi;
        this.thumbApi = environment.thumbApi;
    }
    ngOnDestroy(): void { }
    openSectionProduct(
        action: string,
        typo: string,
        uuid: string,
        name: string,
        isRouterLink?: boolean,
        routerLink?: string,
        orgType?: string
    ): void {
        this.openSectionProductEmit.emit({
            action,
            typo,
            uuid,
            name,
            isRouterLink,
            routerLink,
            orgType,
        });
    }

    createModal(routerLink: string, types: string, modalAction?: string): void {
        this.router
            .navigateByUrl(routerLink + Math.random(), {
                state: {
                    type: types,
                    filter: modalAction,
                    uuid: 'category?.uuid',
                },
            })
            .catch();
        localStorage.setItem('product-list-back', '/tab/dashboard');
    }

    test(type: string, action: string, routerLink?: string): void {
        // const actionData: any = JSON.parse(action);
        const actionData: any = JSON.parse(action);
        if (type.toLocaleLowerCase() === 'category') {
            this.router
                .navigateByUrl('/tab/product-list/' + Math.random(), {
                    state: {
                        filter: actionData.url,
                        uuid: actionData.uuid,
                        type,
                    },
                })
                .catch();
            localStorage.setItem('product-list-back', '/tab/dashboard');
        } else if (type.toLocaleLowerCase() === 'school') {
            this.createModal(
                routerLink,
                type.toLocaleLowerCase(),
                actionData.url
            );
        } else if (type.toLocaleLowerCase() === 'university') {
            this.createModal(
                routerLink,
                type.toLocaleLowerCase(),
                actionData.url
            );
        } else if (type.toLocaleLowerCase() === 'board') {
            this.createModal(
                routerLink,
                type.toLocaleLowerCase(),
                actionData.url
            );
            // } else if (type.toLocaleLowerCase() === 'Custom') {
            //     if (isRouterLink) {
            //         this.router
            //             .navigateByUrl(routerLink, {
            //                 state: {
            //                     type: orgType,
            //                     filter: action,
            //                     uuid: "category?.uuid",
            //                 },
            //             })
            //             .catch();
            //         localStorage.setItem('product-list-back', '/tab/dashboard');
            //     } else {
            //         this.router
            //             .navigateByUrl('/tab/product-list/' + uuid, {
            //                 state: { filter: action, uuid, type },
            //             })
            //             .catch();
            //         localStorage.setItem('product-list-back', '/tab/dashboard');
            //     }
        }
    }
}
