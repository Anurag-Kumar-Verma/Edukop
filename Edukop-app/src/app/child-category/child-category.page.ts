import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
    IonInfiniteScroll,
    ModalController,
    NavController,
} from '@ionic/angular';
import * as interfaces from '@spundan-clients/bookz-interfaces';
import { environment } from 'src/environments/environment';
import { IExamCategories } from '../child-common/exam-child-view/exam-child-view.component';

import { DashboardService } from '../dashboard/service/dashboard.service';
import { IChildCategories } from '../download-child-category/download-child-category.page';
import { SearchModalComponent } from '../search-modal/search-modal.component';
import { LoaderService } from '../shared/loader/loader.service';
import { SharedService } from '../shared/services/shared.service';
import { ClassCategory } from './model/child-category.model';
import { ChildCategoryService } from './services/child-category.service';

@Component({
    selector: 'app-child-category',
    templateUrl: './child-category.page.html',
    styleUrls: ['./child-category.page.scss'],
})
export class ChildCategoryPage implements OnInit {
    @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
    imageApi: string;
    categoryData: string;
    type: string;
    List: any[] = [];
    uuid: string;
    isLoading: boolean;
    pageNumber: number = 1;
    pageLimit: number = 10;
    sectionSchool: any;
    sectionUniversity: interfaces.ISection;
    searchTrue: boolean;
    name: string;
    exam: interfaces.IExam[];
    typeId: string;
    abbreviation: string;
    action: string;
    ChildData: IChildCategories;
    examData: IExamCategories;
    newList: interfaces.IStandard[];
    historyState: any;
    forDownload: boolean;

    // standards;
    constructor(
        public modelController: ModalController,
        public navCtrl: NavController,
        private router: Router,
        private classListService: ChildCategoryService,
        public loadingService: LoaderService,
        public dashboardService: DashboardService,
        public sharedService: SharedService,
        public modalController: ModalController
    ) {}

    ngOnInit(): void {
        this.forDownload = history.state.forDownload;
        if (history?.state?.type) {
            localStorage.setItem(
                'child-category',
                JSON.stringify(history.state)
            );
            this.historyState = history.state;
        }
        this.historyState = localStorage.getItem('child-category')
            ? JSON.parse(localStorage.getItem('child-category'))
            : '';
        this.getStateData();
        this.imageApi = environment.thumbApi;
        this.type = this.type.toLowerCase();
        this.name = this.name;
        if (
            this.type.toLowerCase() !== 'university' &&
            this.type.toLowerCase() !== 'competition'
        ) {
            this.getStandards();
            this.getSectionSchool();
            // this.getSectionBoards();
        } else if (this.type.toLowerCase() === 'university') {
            this.getCourses(false, undefined);
            // this.getSectionUniversity();
        } else if (this.type.toLowerCase() === 'competition') {
            this.getExam(this.categoryData);
        }
    }

    // downloadClassBooks() {
    //     this.router.navigateByUrl('/tab/download-child-category/' + Math.random(), {

    //     });
    // }

    getStateData(): void {
        this.categoryData = this.historyState?.categoryData;
        this.abbreviation = this.historyState?.abbreviation;
        this.type = this.historyState?.type;
        this.name = this.historyState?.name;
        this.uuid = this.historyState?.id;
        this.action = this.historyState?.action;
    }

    classListReOpen(): void {
        this.loadingService.display(true);
        if (this.categoryData === undefined) {
            this.categoryData = this.uuid;
        }
        this.abbreviation = this.abbreviation;
        this.name = this.name;
        this.type = this.type.toLowerCase();
        if (
            this.type.toLowerCase() !== 'university' &&
            this.type.toLowerCase() !== 'competition'
        ) {
            this.getStandards();
        } else if (this.type.toLowerCase() === 'university') {
            this.getCourses(false, undefined);
        } else if (this.type.toLowerCase() === 'competition') {
            this.getExam(this.categoryData);
        }
    }

    getStandardList(uuid: string, name: string, abbreviation: string): void {
        this.loadingService.display(true);
        setTimeout(() => {
            this.loadingService.display(false);
        }, 200);
        this.categoryData = '';
        this.name = '';
        this.abbreviation = '';
        this.categoryData = uuid;
        this.name = name;
        this.abbreviation = abbreviation;
        this.type = this.type.toLowerCase();

        if (
            this.type.toLowerCase() !== 'university' &&
            this.type.toLowerCase() !== 'competition'
        ) {
            this.getStandards();
        }
    }

    getStandards(): void {
        this.classListService.getStandards().subscribe(res => {
            this.List = res.DATA.docs;
            this.newList = this.List.sort((a, b) =>
                Number(a.abbreviation) > Number(b.abbreviation) ? 1 : -1
            );
            this.loadingService.display(false);
            this.ChildData = {
                type: this.type,
                list: this.List,
            };
        });
    }

    downloadClassBooks(): void {
        this.router
            .navigateByUrl('/tab/download-child-category/', {
                state: {
                    categoryData: this.historyState.uuid,
                    abbreviation: this.historyState.abbreviation,
                    type: this.type,
                    name: this.historyState.name,
                    examdata: this.exam,
                },
            })
            .catch();
        localStorage.setItem('child-category-back', '/sub-categories');
    }

    getExam(id: string): void {
        this.classListService.getExam(id).subscribe(response => {
            this.exam = response.DATA.docs;
            this.examData = {
                type: this.type,
                exam: this.exam,
            };
            this.loadingService.display(false);
        });
    }

    // getSectionBoards(): void {
    //     this.dashboardService.getSectionBoards().subscribe((response: any) => {
    //         this.sectionBoards = response.DATA;
    //     });
    // }

    getSectionSchool(): void {
        this.dashboardService.getSectionSchool().subscribe(response => {
            this.sectionSchool = response.DATA;
        });
    }
    // getSectionUniversity(): void {
    //     this.dashboardService
    //         .getSectionUnversity()
    //         .subscribe((response: any) => {
    //             this.sectionUniversity = response.DATA;
    //         });
    // }

    loadData(event: any): void {
        if (this.type.toLowerCase() === 'university') {
            this.getCourses(true, event);
        } else if (this.type.toLowerCase() === 'competition') {
            this.getExam(this.typeId);
        }
    }
    async presentModal(): Promise<void> {
        const modal = await this.modalController.create({
            component: SearchModalComponent,
            cssClass: 'my-custom-class',
            backdropDismiss: true,
        });
        return modal.present();
    }

    getCourses(isFirstLoad: boolean, event: any): void {
        const paginate: interfaces.IPaginate = {
            pageIndex: this.pageNumber,
            pageSize: this.pageLimit,
        };
        this.classListService.getCourses(paginate).subscribe(
            res => {
                if (res.DATA.docs.length < 1) {
                    this.infiniteScroll.disabled = true;
                }
                // tslint:disable-next-line: prefer-for-of
                for (let i = 0; i < res.DATA.docs.length; i++) {
                    this.List.push(res.DATA.docs[i]);
                }
                if (isFirstLoad) {
                    this.infiniteScroll.complete().catch();
                }

                this.pageNumber++;
                this.loadingService.display(false);
            },
            error => {
                this.loadingService.display(false);
            }
        );
        this.ChildData = {
            type: this.type,
            list: this.List,
        };
    }

    productPageEvent($event: { ChildData }): void {
        this.productPage($event.ChildData);
    }

    productPageExamEvent($event: { examData }): void {
        this.productPage($event.examData);
    }

    productPage(category: ClassCategory): void {
        const data = {
            abbreviation: this.abbreviation,
            name: this.categoryData,
            uuid: this.categoryData,
            sub_uuid: category.uuid,
            type: this.type,
            className: category.name,
        };

        // this.presentLoading();
        this.router.navigateByUrl('/tab/product-list/' + Math.random(), {
            state: { data },
        });

        //localStorage.setItem('back-route', '/product-list');
        //localStorage.setItem('product-list-back','/child-category');
        // localStorage.setItem('product-list-back', '/child-category');
    }

    goback(): void {
        this.navCtrl.back();
    }
}
