import { Component, Input, OnInit } from '@angular/core';
import { RouteService } from '../../services/router.service';
import * as interfaces from '@spundan-clients/bookz-interfaces';

@Component({
    selector: 'app-pdf-viewer',
    templateUrl: './pdf-viewer.component.html',
    styleUrls: ['./pdf-viewer.component.scss'],
})
export class PdfViewerComponent implements OnInit {
    path: string;
    info: interfaces.IProduct;
    zoom_to: number = 1.0;
    zoomScale: any = 'page-fit';
    constructor(
        public routeService: RouteService,
    ) { }

    ngOnInit() {
        this.path = history.state.path;
        this.info = history.state.data;
    }
    goback() {
        this.routeService.navigateToBack('ionic');
    }

    zoom_in() {
        this.zoom_to = this.zoom_to + 0.5;
    }

    zoom_out() {
        if (this.zoom_to > 1) {
            this.zoom_to = this.zoom_to - 0.15;
        }
    }
}
