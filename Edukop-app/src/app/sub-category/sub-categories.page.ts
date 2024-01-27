import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
    IonInfiniteScroll,
    ModalController,
    NavController,
    Platform,
} from '@ionic/angular';
import {
    IBoard,
    ICategoryTreeResponse,
    ICompetition,
    ICompetitionExamCategory,
    IDynamicForm,
    IProduct,
    IResponsePaginationGet,
    ISchool,
    IUniversity,
} from '@spundan-clients/bookz-interfaces';

import { environment } from '../../environments/environment';
import { AllCategories } from '../all-categories/service/all-categories.service';
import { SubCategoryService } from './services/sub-categories.service';
import { ChildCategoryPage } from '../child-category/child-category.page';
import { DynamicFormService } from '../dynamic-form/services/dynamic-forms.service';
import { SearchModalComponent } from '../search-modal/search-modal.component';
import { LoaderService } from '../shared/loader/loader.service';
import { SharedService } from '../shared/services/shared.service';
import { ToastService } from '../shared/services/toast.service';
import { CategoryStateService } from '../shared/state/category.state';
import { ISubCategories } from '../sub-category-components/card-view/card-view.component';

@Component({
    selector: 'app-sub-categories',
    templateUrl: './sub-categories.page.html',
    styleUrls: ['./sub-categories.page.scss'],
})
export class SubCategoryPage implements OnInit {
    @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

    isDataLoaded: boolean = false;
    boards: IBoard[];
    courses: IUniversity[];
    schools: ISchool[];
    imageEnvUrl: string;
    type: string;
    name: string;
    categoryData: (IBoard | ISchool | IUniversity | ICompetition)[] = [];
    searchTrue: boolean = false;
    filter: string;
    isLoading: boolean;
    isExitCount: number = 1;
    pageNumber: number = 1;
    pageLimit: number = 8;
    examCategory: ICompetitionExamCategory[];
    chipArray: string[] = [];
    categoryTree: ICategoryTreeResponse[];
    categoryChild: ICategoryTreeResponse;
    categoryUUID: string;
    dynamicChild: ICategoryTreeResponse[] = [];
    catFound: ICategoryTreeResponse;
    categoryHistory: ICategoryTreeResponse[] = [];
    index: number = 0;
    enrollments: IDynamicForm[] = [];
    schoolData: ISchool[] = [];
    subData: any;
    enrollmentData: any;
    backSubscription: any;
    historyState: any;
    forDownload: boolean;

    constructor(
        private navCtrl: NavController,
        public router: Router,
        public boardService: SubCategoryService,
        public loadingService: LoaderService,
        public sharedService: SharedService,
        public modalController: ModalController,
        public platform: Platform,
        public dynamicService: DynamicFormService,
        public toastService: ToastService,
        public categoryService: AllCategories,
        public categoryStateService: CategoryStateService
    ) {
        const url1: string[] = this.router.url.split('/');
        this.backSubscription = this.platform.backButton.subscribe(() => {
            if (this.router.url === '/tab/sub-categories/' + url1[3]) {
                this.goback('platform');
            } else {
            }
        });
    }

    ngOnInit(): void {
        if (history.state?.uuid) {
            this.historyState = history.state;
            this.type = this.historyState.type;
            localStorage.setItem(
                'sub-categories',
                JSON.stringify(history.state)
            );
        }
        this.historyState = localStorage.getItem('sub-categories')
            ? JSON.parse(localStorage.getItem('sub-categories'))
            : '';
        this.type = this.historyState.type;
        this.imageEnvUrl = environment.thumbApi;
        // tslint:disable-next-line: strict-boolean-conditions
        if (this.type === 'novel' || this.categoryUUID) {
            this.categoryUUID = this.historyState.uuid;
            this.getCategoryState();
        } else if (this.type === 'Admission Form') {
            this.enrollmentData = {
                type: this.type,
                schoolData: this.schoolData,
            };
            this.getEnrollments(false);
        } else {
            this.filter = this.historyState.filter;
            this.searchTrue = false;
            this.getCategoryData(this.filter, false, undefined);
        }
        this.subData = {
            type: this.type,
            categoryData: this.categoryData,
        };
    }

    ionViewWillLeave(): void {
        // this.backSubscription.unsubscribe();
    }

    formList(): void {
        this.navCtrl.navigateForward('/tab/form-list/' + Math.random()).catch();
    }

    loadData(event: any): void {
        this.type === 'Admission Form'
            ? this.getEnrollments(true)
            : this.getCategoryData(this.filter, true, event);
    }

    OpenFormEvent($event: { schoolData }): void {
        this.OpenForm($event.schoolData);
    }

    OpenForm(school: string): void {
        this.dynamicService
            .getDynamicFormByEnrollmentId(school)
            .subscribe(res => {
                if (res.DATA) {
                    const d1 = 'productById?uuid=' + res.DATA.uuid;
                    const type = 'Product';
                    const uuid = res.DATA.uuid;
                    const isDigital = true;
                    localStorage.setItem('back-route', '/sub-categories');
                    this.router
                        .navigateByUrl('/tab/product-page/' + Math.random(), {
                            state: { filter: d1, type, uuid, isDigital },
                        })
                        .catch();
                } else {
                    this.toastService.showToast('No Data Found', 'end').catch();
                }
            });

        // this.navCtrl.navigateRoot('/dynamic-form').catch();
    }

    getCategoryData(
        filter: string,
        isFirstLoad: boolean,
        event: any
    ): void {
        let str = filter;
        const lastIndex = str?.lastIndexOf('/');
        str = str.substring(0, lastIndex);

        filter = str + `?size=${this.pageLimit}&page=${this.pageNumber}`;
        this.searchTrue = false;
        if (!isFirstLoad) {
            this.loadingService.display(true);
        }
        this.sharedService.getCategoryData(filter).subscribe(
            response => {
                response = response as IResponsePaginationGet<
                    IBoard[] | ISchool[] | ICompetition[] | IUniversity[]
                >;
                response.DATA.docs = response.DATA.docs as
                    | IBoard[]
                    | ISchool[]
                    | ICompetition[]
                    | IUniversity[];
                if (response.DATA.docs.length < 1) {
                    this.infiniteScroll.disabled = true;
                }
                // tslint:disable-next-line: prefer-for-of
                for (let i = 0; i < response.DATA.docs.length; i++) {
                    this.categoryData.push(response.DATA.docs[i]);
                }
                this.subData = {
                    type: this.type,
                    categoryData: this.categoryData,
                };
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
    }

    downloadAction(data): void {
        if (data.childs) {
            const uuid = data.id;
            const type = 'Category';
            this.router
                .navigateByUrl('/tab/product-list/' + Math.random(), {
                    state: { filter: undefined, uuid, type },
                })
                .catch();
        } else {
            this.router
                .navigateByUrl('/tab/download-by-category/' + Math.random(), {
                    state: { data },
                })
                .catch();
        }
    }

    chipClose(): void {
        this.pageNumber = 1;
        this.chipArray = [];
        this.categoryData = [];
        this.getCategoryData(this.filter, false, undefined);
    }

    OpenStListEvent($event: {
        info: IBoard  | ISchool | IUniversity | ICompetition;
    }): void {
        this.OpenStList($event.info);
    }

    OpenStList(
        categoryData: IBoard | ISchool | IUniversity | ICompetition
    ): void {
        this.createModal(categoryData);
        //  this.dismissModal();
    }
    openCategoryTreeEvent($event: { catFound }): void {
        this.openCategoryTree($event.catFound);
    }

    openCategoryTree(categoryData: ICategoryTreeResponse): void {
        const uuid = categoryData.id;
        const type = 'Category';
        if (!categoryData?.childs) {
            this.router
                .navigateByUrl('/tab/product-list/' + Math.random(), {
                    state: { filter: undefined, uuid, type },
                })
                .catch();
        } else {
            this.catFound = categoryData;
            this.categoryHistory.push(categoryData);
        }
    }

    dismissModal(): void {
        this.modalController
            .dismiss({
                dismissed: true,
            })
            .catch();
    }

    createModal(
        categoryData: IBoard | ISchool | IUniversity | ICompetition
    ): void {
        console.log(categoryData);
        if (this.type != "School Uniform" && this.type != "College Uniform") {
        this.router
            .navigateByUrl('/tab/child-category/' + Math.random(), {
                state: {
                    categoryData: categoryData.uuid,
                    abbreviation: categoryData.abbreviation,
                    type: this.type,
                    name: categoryData.name,
                },
            })
            .catch();
        localStorage.setItem('child-category-back', '/sub-categories');
        }else {
            const data = {
                abbreviation: categoryData.abbreviation,
                name: this.categoryData,
                uuid: categoryData.uuid,
                category_uuid: this.historyState.uuid,
                type: this.type,
            };
            // this.presentLoading();
            this.router.navigateByUrl('/tab/product-list/' + Math.random(), {
                state: { data },
            });
        }
    }

    goback(action: string): void {
        this.categoryHistory.reverse();
        this.index++;
        if (this.type === 'novel') {
            if (this.index < this.categoryHistory.length) {
                document.addEventListener(
                    'backbutton',
                    function (event) {
                        event.preventDefault();
                        event.stopPropagation();
                    },
                    false
                );
                this.catFound = this.categoryHistory[this.index];
                this.categoryHistory.splice(this.index - 1, 1);
                this.index--;
            } else {
                this.router.navigateByUrl('/tab/dashboard');
            }
        } else if (this.type === 'Admission Form') {
            this.router.navigateByUrl('/tab/dashboard');
        } else {
            localStorage.removeItem('state');
            if (this.chipArray.length > 0) {
                this.chipClose();
            } else {
                this.router.navigateByUrl('/tab/dashboard');
                // this.navCtrl.back();
            }
        }
    }

    async presentModal(): Promise<void> {
        const modal = await this.modalController.create({
            component: SearchModalComponent,
            cssClass: 'my-custom-class',
            componentProps: { type: this.type },
            backdropDismiss: true,
            id: 'search',
        });
        modal
            .onDidDismiss()
            .then(data => {
                this.loadingService.display(true);
                if (data['data']) {
                    if (!data['data'].dismissed) {
                        this.categoryData = [];
                        data['data'].forEach(dt => {
                            this.categoryData.push(dt);
                        });
                        if (data['role']) {
                            this.chipArray.push(data['role']);
                        }
                        this.subData = {
                            type: this.type,
                            categoryData: this.categoryData,
                        };
                        this.searchTrue = true;
                        this.loadingService.display(false);
                    }
                } else {
                }
                this.loadingService.display(false);
            })
            .catch();
        return modal.present();
    }

    getCategoryState(): void {
        this.categoryStateService.getCategoryState().subscribe(val => {
            if (val !== undefined && val !== null) {
                this.categoryTree = val;
                this.getDynamicCategory();
            }
        });
    }

    getDynamicCategory(): void {
        const result = this.findCate(this.categoryTree);
    }

    findCate(currentTree: ICategoryTreeResponse[]): void {
        if (this.catFound) {
            return;
        }
        if (currentTree != null && currentTree?.length > 0) {
            const index = currentTree.findIndex(
                a => a.id === this.categoryUUID
            );
            if (index >= 0) {
                this.catFound = currentTree[index];
                this.categoryHistory.push(this.catFound);
            } else {
                // tslint:disable-next-line: prefer-for-of
                for (let indexes = 0; indexes < currentTree.length; indexes++) {
                    this.findCate(currentTree[indexes].childs);
                }
            }
        }
    }

    getEnrollments(isFirstLoad: boolean): void {
        const filter = `?size=${this.pageLimit}&page=${this.pageNumber}`;
        // this.boardService.getEnrollments(filter).subscribe(res => {
        //     this.enrollments = res.DATA.docs;
        //     this.getSchoolsByUUIDS();
        // });

        this.searchTrue = false;
        if (!isFirstLoad) {
            this.loadingService.display(true);
        }
        this.boardService.getEnrollments(filter).subscribe(
            response => {
                if (response.DATA.docs.length < 1) {
                    this.infiniteScroll.disabled = true;
                    this.isDataLoaded = true;
                    this.loadingService.display(false);
                    return;
                }
                // tslint:disable-next-line: prefer-for-of
                for (let i = 0; i < response.DATA.docs.length; i++) {
                    this.enrollments = response.DATA.docs;
                }
                if (isFirstLoad) {
                    this.infiniteScroll.complete().catch();
                }
                this.getSchoolsByUUIDS();

                this.pageNumber++;
                //   this.loadingService.display(false);
            },
            error => {
                this.loadingService.display(false);
            }
        );
    }

    getSchoolsByUUIDS(): void {
        this.sharedService
            .getSchoolsByIds(this.enrollments.map(a => a.org_id))
            .subscribe(res => {
                this.isDataLoaded = true;

                for (let i = 0; i < res.DATA.docs.length; i++) {
                    this.schoolData.push(res.DATA.docs[i]);
                }
                if (this.isDataLoaded) {
                    setTimeout(() => {
                        this.loadingService.display(false);
                    }, 300);
                }
            });
    }
}
