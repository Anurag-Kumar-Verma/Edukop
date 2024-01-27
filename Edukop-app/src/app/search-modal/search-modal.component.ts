import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSearchbar, ModalController } from '@ionic/angular';
import * as interfaces from '@spundan-clients/bookz-interfaces';
import { environment } from 'src/environments/environment';

import { DashboardService } from '../dashboard/service/dashboard.service';
import { LoaderService } from '../shared/loader/loader.service';
import { ProductStateService } from '../shared/state/product.state';

import { SearchService } from './services/search.service';

@Component({
    selector: 'app-search-modal',
    templateUrl: './search-modal.component.html',
    styleUrls: ['./search-modal.component.scss'],
})
export class SearchModalComponent implements OnInit {
    isEnterPress: boolean;
    imageApi: string;
    type: string = '';
    searchData: any[] = [];
    recentSearch: string[];
    recentSearchData: string[];
    isLoading: boolean;
    noData: boolean = false;
    redirectFrom: string;
    searchValue: string;
    constructor(
        public modelController: ModalController,
        private searchService: SearchService,
        public router: Router,
        public dashboardService: DashboardService,
        public loadingService: LoaderService,
        public productState: ProductStateService
    ) { }
    @ViewChild('search', { static: true }) searchBar: IonSearchbar;

    ngOnInit(): void {
        this.imageApi = environment.thumbApi;
        setTimeout(() => this.searchBar.setFocus(), 1000);
        this.getHistory();
        // this.getTopDeals();
    }
    // getTopDeals(): void {
    //     this.dashboardService.getTopDeals().subscribe((response: any) => {
    //         this.deals = response.DATA.docs;
    //     });
    // }
    getProducts(searchWord: string): void {
        this.searchData = [];
        let searchkeyword: string;
        searchkeyword = searchWord;
        // this.searchkeyword = event.target.value;
        let searchData: object;
        if (searchkeyword !== '') {
            this.isLoading = true;
            if (this.recentSearchData) {
                this.recentSearch = this.recentSearchData.filter(name => {
                    return name.includes(searchkeyword);
                });
            }
            if (this.type.length > 0) {
                searchData = {
                    // tslint:disable-next-line: strict-boolean-expressions
                    search_string: searchkeyword || '',
                    type: this.type,
                };
                this.searchService.categorySearch(searchData).subscribe(
                    response => {
                        this.isLoading = false;
                        if (
                            response.DATA !== undefined &&
                            response.DATA.length > 0
                        ) {
                            this.noData = false;
                            this.searchData = response.DATA;
                        } else {
                            this.noData = true;
                        }
                        if (this.isEnterPress) {
                            this.modelController
                                .dismiss(response.DATA, searchkeyword)
                                .catch();
                        }
                    },
                    error => { }
                );
            } else {
                searchkeyword = searchWord;
                searchData = {
                    // tslint:disable-next-line: strict-boolean-expressions
                    search_string: searchkeyword || '',
                };
                this.searchService.search(searchData).subscribe(
                    response => {
                        this.isLoading = false;
                        // this.noData = response.DATA.some((data) => !data.docs.length);
                        this.noData = response.DATA.length < 1;
                        response.DATA.map(data => {
                            if (data.docs) {
                                data.docs.map(doc => {
                                    this.searchData.push(doc);
                                });
                            } else {
                                //      this.noData = true;
                            }
                        });
                        if (this.isEnterPress) {
                            this.modelController
                                .dismiss(undefined, undefined, undefined)
                                .catch();

                            this.router
                                .navigateByUrl(
                                    '/tab/product-list/' + searchkeyword,
                                    {
                                        state: { search_string: searchkeyword },
                                    }
                                )
                                .catch();
                        }
                    },
                    error => { }
                );
            }
        } else {
            this.noData = false;
            this.searchData = [];
            this.recentSearch = this.recentSearchData;
        }
    }

    searchAgain(searchValue: string): void {
        this.searchValue = searchValue;
        const searchData = {
            // tslint:disable-next-line: strict-boolean-expressions
            search_string: this.searchValue || '',
        };
        // this.searchService.search(searchData).subscribe(
        //   (response) => {
        //     this.searchData = response.DATA;
        //   },
        //   (error) => {}
        // );
    }

    onSelect(
        product:
            | interfaces.IProduct
            | interfaces.IUniversity
            | interfaces.ISchool
            | interfaces.ICompetition
            | interfaces.IBoard
    ): void {
        const productArray: (
            | interfaces.IProduct
            | interfaces.IUniversity
            | interfaces.ISchool
            | interfaces.ICompetition
            | interfaces.IBoard
        )[] = [];
        if (
            this.type !== '' &&
            this.type !== 'school' &&
            this.type !== 'board' &&
            this.type !== 'university' &&
            this.type !== 'novel'
        ) {
            productArray.push(product);
            this.modelController.dismiss(productArray, product.name).catch();
        } else {
            product = product as
              | interfaces.IProduct
              | interfaces.ISchool
              | interfaces.IUniversity;
            if (product.isType === 'product') {
                if (this.redirectFrom === 'product-page') {
                    this.modelController.dismiss({ product }).catch();
                } else {
                    const d1 = 'productById?uuid=' + product.uuid;
                    localStorage.setItem('back-route', '/tab/dashboard');
                    this.productState.setProductState(product.uuid);
                    this.router
                        .navigateByUrl('/tab/product-page/' + Math.random(), {
                            state: {
                                filter: d1,
                                type: 'Product',
                                uuid: product.uuid,
                            },
                        })
                        .catch();
                    this.modelController.dismiss().catch();
                }
            } else if (product.isType === 'category') {
                const data = {
                    uuid: (product as interfaces.ICategory).category_uuid,
                    type: 'category',
                };
                this.router
                    .navigateByUrl('/tab/product-list/' + data.uuid, {
                        state: { data },
                    })
                    .catch();
                this.modelController.dismiss().catch();
            } else if (product.isType === "school" || product.isType === "university") {
                product = product as interfaces.ISchool | interfaces.IUniversity;
                this.router
                  .navigateByUrl("/tab/child-category/" + Math.random(), {
                    state: {
                      categoryData: product.uuid,
                      abbreviation: product.abbreviation,
                      type: product.isType,
                      name: product.name,
                    },
                  })
                  .catch();
              this.modelController.dismiss().catch();
            } else {
              this.modelController
                .dismiss([product], product.name, "search")
                .catch();
              // this.createModal(product.uuid, product.isType, product.name).catch();
            }
        }
    }

    async createModal(
        uuid: string,
        modalType: string,
        modalName: string
    ): Promise<void> {
        this.router
            .navigateByUrl('/tab/sub-categories/' +  Math.random(), {
                state: {
                    categoryData: uuid,
                    type: modalType,
                    name: modalName,
                },
            })
            .catch();
    }

    remove(searchString: string): void {
        this.searchService
            .deleteSearchStringHistory(searchString)
            .subscribe(res => {
                this.getHistory();
                // this.loadingDismiss();
            });
    }

    getHistory(): void {
        this.dashboardService.getRecentProducts().subscribe(res => {
            if (res.DATA !== null) {
                this.recentSearchData = res.DATA.searchString.filter(
                    word => word.length <= 10
                );
                this.recentSearch = this.recentSearchData;
            }
        });
    }

    searchCancel(): void {
        this.dismissModal();
    }

    dismissModal(): void {
        this.modelController
            .dismiss({
                dismissed: true,
            })
            .catch();
    }

    onEnter(searchKeyword: string): void {
        this.isEnterPress = true;
        this.getProducts(searchKeyword);
    }
}
