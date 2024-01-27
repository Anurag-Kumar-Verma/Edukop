import { Component, OnInit } from '@angular/core';
import * as interfaces from '@spundan-clients/bookz-interfaces';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { LoaderService } from '../shared/loader/loader.service';
import { ISchool } from '../models/ISchool.model';

@Component({
    selector: 'app-download-by-category',
    templateUrl: './download-by-category.page.html',
    styleUrls: ['./download-by-category.page.scss'],
})
export class DownloadByCategoryPage implements OnInit {
    forDownload: boolean;
    imageApi: string;
    categoryData: ISchool[];
    data: any;
    type: string;
    constructor(public navCtrl: NavController, public router: Router,
        public loadingService: LoaderService,) {}

    ngOnInit() {
        this.loadingService.display(true);
        this.imageApi = environment.thumbApi;
        this.data = history.state.data;
        this.type = history.state.data.type;
        this.categoryData = history.state.data.categoryData;
        this.loadingService.display(false);
    }

    goback(): void {
        this.navCtrl.back();
    }
    createModal(
        categoryData:
            | interfaces.IBoard
            | interfaces.ISchool
            | interfaces.IUniversity
            | interfaces.ICompetition
    ): void {
        this.router
            .navigateByUrl(
                '/tab/download-child-category/' + categoryData.uuid,
                {
                    state: {
                        categoryData: categoryData.uuid,
                        abbreviation: categoryData.abbreviation,
                        type: this.type,
                        name: categoryData.name,
                        uuid: categoryData.uuid,
                    },
                }
            )
            .catch();
        localStorage.setItem('child-category-back', '/sub-categories');
    }
}
