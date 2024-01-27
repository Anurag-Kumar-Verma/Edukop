import { Component, OnInit } from '@angular/core';
import { RouteService } from '../shared/services/router.service';

@Component({
    selector: 'app-terms-of-use',
    templateUrl: './terms-of-use.component.html',
    styleUrls: ['./terms-of-use.component.scss'],
})
export class TermsOfUseComponent implements OnInit {
    constructor(public routeService: RouteService) {}

    ngOnInit(): void {}

    goback(): void {
        this.routeService.navigateToBack('/dashboard');
    }
}
