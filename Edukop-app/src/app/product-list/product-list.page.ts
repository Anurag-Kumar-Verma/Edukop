import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
    ActionSheetController,
    IonInfiniteScroll,
    ModalController,
    NavController,
    NavParams,
    Platform,
    ToastController,
} from '@ionic/angular';
import * as interfaces from '@spundan-clients/bookz-interfaces';
import { Observable, forkJoin } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/services/auth.service';

import { CartService } from '../cart/services/cart-service';
import { ChildCategoryPage } from '../child-category/child-category.page';
import { DashboardService } from '../dashboard/service/dashboard.service';
import { FilterModalComponent } from '../filter-modal/filter-modal.component';
import { IProduct } from '../models/IProduct.model';
import { SearchModalComponent } from '../search-modal/search-modal.component';
import { LoaderService } from '../shared/loader/loader.service';
import { RouteService } from '../shared/services/router.service';
import { SharedService } from '../shared/services/shared.service';
import { ToastService } from '../shared/services/toast.service';
import { CartStateService } from '../shared/state/cart.state';
import { WishlistService } from '../wishlist/service/wishlist.service';

export interface NavState {
    navigationId: string;
    filter: string;
    type: string;
    uuid: string;
}

export interface NavigationState {
    type: string;
    uuid: string;
    name: string;
    className: string;
    sub_uuid: string;
    abbreviation: string;
    category_uuid: string;
}

export interface SearchModel {
    sort?: number;
    abbreviation?: string;
    className?: string;
    uuid: string;
    sub_uuid: string;
    category_uuid?: string;
    attribute_value?: string[];
    isDigital?: string;
    min?: number;
    max?: number;
}

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.page.html',
    styleUrls: ['./product-list.page.scss'],
})
export class ProductListPage implements OnInit {
    sections: Array<{
        uuid: string;
        viewType: string;
        sequence: string;
    }>;
    collectionDATA: Array<
        Array<{
            uuid: string;
            viewType: string;
            sequence: string;
        }>
    > = [];
    dynamicSection: Array<{
        data: interfaces.ICollection;
        viewType: string;
    }> = [];
    isSection: boolean;
    chipArray: string[] = [];
    historyState: any;
    wishList: any[] = [];
    isDataLoaded: boolean = false;
    isDigital: string;
    min: number = 0;
    max: number = 10000;
    constructor(
        private navCtrl: NavController,
        private router: Router,
        private sharedService: SharedService,
        public modalController: ModalController,
        public toastController: ToastController,
        public loadingService: LoaderService,
        public actionSheetController: ActionSheetController,
        public wishlistService: WishlistService,
        public cartStateService: CartStateService,
        public cartService: CartService,
        public platform: Platform,
        public modelController: ModalController,
        public dashboardService: DashboardService,
        public auth: AuthService,
        public toast: ToastService,
        public routeService: RouteService
    ) {
        this.loadingService.display(true);
    }
    @ViewChild(IonInfiniteScroll, { static: false })
    infiniteScroll: IonInfiniteScroll;

    // @Output() productFilter: EventEmitter<any> = new EventEmitter();
    productList: IProduct[] = [];
    categoryFilter: interfaces.IAttribute[];
    sort: number = 1; // 1 - low to high, -1 - high to low
    categoryUUID: string;
    dashboardSearchType: string;
    schoolUUID: string;
    standardUUID: string;
    selectedFilter: string[] = [];
    state: NavState;
    iconActive: boolean = false;
    wishListData: interfaces.IWishlist;
    cartBadge: number;
    filterApi: string;
    uuid: string;
    type: string;
    params: NavigationState;
    isExitCount: number = 1;
    pageNumber: number = 0;
    pageLimit: number = 10;
    pageNumberRelavent: number = 1;
    pageLimitRelavent: number = 10;
    filterApply: boolean = false;
    noData: boolean = false;
    name: string;
    className: string;
    relaventData: interfaces.IProduct[] = [];
    abbreviation: string;
    thumbApi: string;
    searchDataForFilter: SearchModel;

    wishlistProductIds: string[] = [];
    noRelavantData: boolean = false;

    ionViewWillEnter(): void {
        if (this.selectedFilter && this.selectedFilter.length > 0) {
          return;
        }
        if (
            history?.state?.uuid ||
            history?.state?.data ||
            history?.state?.search_string ||
            history?.state?.type === 'Custom'
        ) {
            localStorage.setItem('product-list', JSON.stringify(history.state));
            this.historyState = history.state;
        } else {
        this.historyState = localStorage.getItem('product-list')
            ? JSON.parse(localStorage.getItem('product-list'))
            : '';}
        this.cartStateService.getCartState().subscribe(val => {
            this.cartBadge = val;
        });
        this.isDigital = this.historyState.data?.isDigital
            ? this.historyState.data?.isDigital
            : false;
        this.getWishList();
        this.thumbApi = environment.thumbApi;
        if (!this.filterApply) {
            if (!this.params) {
                this.params = this.historyState?.data
                    ? this.historyState.data
                    : this.historyState;
            }
            if (!this.historyState) {
                this.historyState = history;
            }
            const localState: string = localStorage.getItem('state');

            if (localState !== undefined) {
                this.state = JSON.parse(localState);
            }

            if (!this.state) {
                this.filterApi = this.historyState.filter;
                this.type = this.historyState.type;
                this.name = this.historyState.name;
                this.className = this.historyState.name;
                this.uuid = this.historyState.uuid;
            } else {
                if (this.state?.navigationId !== '') {
                    this.filterApi = this.state.filter;
                    this.name = this.historyState.name;
                    this.type = this.state.type;
                    this.className = this.historyState.name;
                    this.uuid = this.state.uuid;
                }
            }
        }
        this.dashboardSearchType = this.params.type;
        this.type = this.params.type;
        // this.search(params.uuid, params.sub_uuid);
        if (
            this.dashboardSearchType === 'category' ||
            this.type === 'Category'
        ) {

            this.categoryUUID = this.params.uuid;
            this.searchByCategory(this.params.uuid);
            this.searchProductByCategory(this.params.uuid, false, undefined);
        } else if (this.type === 'Product') {
            this.sharedService
                .getCategoryData(this.filterApi)
                .subscribe(res => {
                    res = res as IProduct;
                    this.productList = [];
                    this.productList.push(res as IProduct);
                    // this.isDataLoaded = true;
                });
        }
        if (this.dashboardSearchType === 'custom' || this.type === 'Custom') {
            // this.categoryUUID = this.params.uuid;
            // this.searchByCategory(this.params.uuid);
            this.searchByDiscount(
                (this.params as any).filter,
                false,
                undefined
            );
        } else if (this.historyState?.search_string) {
            this.chipArray.push(this.historyState?.search_string);
            this.searchFilterByEnter(
                this.historyState?.search_string,
                false,
                true,
                undefined
            );
            this.searchByEnter(
                this.historyState?.search_string,
                false,
                false,
                undefined
            );
        } else {
            if (
                this.dashboardSearchType === 'category' ||
                this.type === 'Category'
            ) {
                return;
            }
            let searchData: SearchModel;
            this.name = this.params.name;
            this.className = this.params.className;
            this.schoolUUID = this.params.uuid;
            this.standardUUID = this.params.sub_uuid;
            this.categoryUUID = this.params.category_uuid
            searchData = {
                min: this.min,
                max: this.max,
                abbreviation: this.abbreviation,
                className: this.className,
                uuid: this.schoolUUID,
                sub_uuid: this.standardUUID,
                isDigital: this.isDigital,
                category_uuid: this.categoryUUID
            };
            this.searchDataForFilter = searchData;
            // this.search(searchData, false, undefined, () => {
            //     if (this.sections?.length > 0){
            //         return;
            //     }
            //     else {
            //         this.getSection(this.type);
            //     }
            // });
            this.ProductCategoryFilter(
                this.params.uuid,
                this.params.sub_uuid,
                this.params.className,
                this.params.abbreviation,
                this.params.category_uuid
            );
            this.getSection(this.type);
        }
    }

    ngOnInit(): void {}
    async ionViewWillLeave(): Promise<void> {
        const actionSheet = await this.actionSheetController.getTop();
        if (actionSheet) {
            actionSheet.dismiss();
        }
        this.pageNumberRelavent = 1;
        this.relaventData = [];
    }

    openSectionProductEvent($event: {
        action: string;
        typo: string;
        uuid: string;
        name: string;
    }): void {
        this.openSectionProduct(
            $event.action,
            $event.typo,
            $event.uuid,
            $event.name
        );
    }
    openSectionProduct(
        action: string,
        type: string,
        uuid: string,
        name: string
    ): void {
        if (type === 'Product') {
            const d1 = action + '?uuid=' + uuid;
            // localStorage.setItem('back-route', '/tab/dashboard');
            this.router
                .navigateByUrl('/tab/product-page/' + Math.random(), {
                    state: { filter: d1, type, uuid },
                })
                .catch();
        } else if (type === 'Category') {
            this.router
                .navigateByUrl('/tab/product-list/' + uuid, {
                    state: { filter: action, uuid, type },
                })
                .catch();
        } else if (type === 'School') {
            this.createModal(uuid, type, action, name).catch();
        } else if (type === 'University') {
            this.createModal(uuid, type, action, name).catch();
        } else if (type === 'Board') {
            this.createModal(uuid, type, action, name).catch();
        }
    }
    async createModal(
        uuid: string,
        types: string,
        actions: string,
        names: string
    ): Promise<void> {
        localStorage.setItem('child-category-back', '/tab/dashboard');
        this.router
            .navigateByUrl('/tab/child-category/' + Math.random(), {
                state: {
                    categoryData: uuid,
                    type: types,
                    action: actions,
                    name: names,
                },
            })
            .catch();
    }

    private searchByEnter(
        searchString: string,
        isFilter: boolean,
        isFirstLoad: boolean,
        event: any
    ): void {
        const paginate: interfaces.IPaginate = {
            pageIndex: this.pageNumber + 1,
            pageSize: this.pageLimit,
        };
        this.sharedService
            .getSearchProducts(searchString, false, paginate)
            .subscribe(
                response => {
                    if (response) {
                        if (response.DATA.docs.length < 1) {
                            this.isDataLoaded = true;
                            this.noData = true;
                        }

                        // tslint:disable-next-line: prefer-for-of
                        for (let i = 0; i < response.DATA.docs.length; i++) {
                            this.productList.push(response.DATA.docs[i] as IProduct);
                        }
                        if (isFirstLoad) {
                            this.infiniteScroll.complete().catch();
                        }

                        if (response.DATA.docs.length > 0) {
                            this.noData = false;
                            this.pageNumber++;
                        }
                    } else {
                        this.isDataLoaded = true;
                    }

                    this.loadingService.display(false);
                },
                error => {
                    this.loadingService.display(false);
                }
            );
    }

    private searchFilterByEnter(
        searchString: string,
        isFilter: boolean,
        isFirstLoad: boolean,
        event: any
    ): void {
        const paginate: interfaces.IPaginate = {
            pageIndex: this.pageNumber + 1,
            pageSize: this.pageLimit,
        };

        this.sharedService
            .getSearchProducts(searchString, true, paginate)
            .subscribe(
                response => {
                    this.categoryFilter = (response.DATA as unknown) as interfaces.IAttribute[];
                },
                error => {
                    this.loadingService.display(false);
                }
            );
    }

    requestProduct(): void {
        this.router
            .navigateByUrl('/tab/request-product/' + Math.random())
            .catch();
    }

    getSection(type: string): void {
        this.loadingService.display(true);
        const searchData = {
            abbreviation: this.abbreviation,
            className: this.className,
            uuid: this.schoolUUID,
            sub_uuid: this.standardUUID,
            isDigital: this.isDigital,
            min: this.min,
            max: this.max,
            category_uuid: this.categoryUUID
        };
        this.dashboardService.getSectionofCollection(type).subscribe(
            sectionDATA => {
                if (sectionDATA) {
                    // this.isDataLoaded = true;
                    this.sections = sectionDATA.DATA.collectionData;
                    this.sections = this.sections.sort((a, b) =>
                        Number(a.sequence) > Number(b.sequence) ? 1 : -1
                    );
                }
                this.search(searchData, false, undefined);
            },
            error => {
                // this.isDataLoaded = true;
                this.search(searchData, false, undefined);
                this.loadingService.display(false);
            }
        );
    }

    getCollectionById(id: string): Observable<interfaces.ICollection> {
        return this.dashboardService.getCollectionById(id);
    }

    releventOfSchool(
        searchData: SearchModel,
        isFirstLoad: boolean,
        event: any
    ): void {
        const paginate: interfaces.IPaginate = {
            pageIndex: this.pageNumberRelavent,
            pageSize: this.pageLimitRelavent,
        };
        this.sharedService.releventOfSchool(searchData, paginate).subscribe(
            response => {
                if (
                    response.DATA.boardStandardData.docs.length < 1 &&
                    response.DATA.standardData.docs.length < 1
                ) {
                    // if (!response.DATA.standardData.docs.length) {
                    this.noRelavantData = true;
                    if (isFirstLoad) {
                        this.infiniteScroll.complete().catch();
                    }
                }
                // tslint:disable-next-line: prefer-for-of
                for (
                    let i = 0;
                    i < response.DATA.standardData.docs?.length;
                    i++
                ) {
                    this.relaventData.push(response.DATA.standardData.docs[i]);
                }
                // tslint:disable-next-line: prefer-for-of
                for (
                    let i = 0;
                    i < response.DATA.boardStandardData.docs.length;
                    i++
                ) {
                    this.relaventData.push(
                        response.DATA.boardStandardData.docs[i]
                    );
                }
                if (
                    response.DATA.boardStandardData.docs.length > 0 ||
                    response.DATA.standardData.docs.length > 0
                ) {
                    // if (response.DATA.standardData.docs.length) {
                    this.pageNumberRelavent++;
                }
                if (isFirstLoad) {
                    this.infiniteScroll.complete().catch();
                }

                // this.presentLoading();
            },
            error => {
                this.noRelavantData = true;
                if (isFirstLoad) {
                    this.infiniteScroll.complete().catch();
                }
                // this.presentLoading();
            }
        );
    }

    releventOfBoard(
        searchData: SearchModel,
        isFirstLoad: boolean,
        event: any
    ): void {
        const paginate: interfaces.IPaginate = {
            pageIndex: this.pageNumberRelavent,
            pageSize: this.pageLimitRelavent,
        };
        this.sharedService.releventOfBoard(searchData, paginate).subscribe(
            response => {
                if (response.DATA.standardData.docs?.length < 1) {
                    this.noRelavantData = true;
                    if (isFirstLoad) {
                        this.infiniteScroll.complete().catch();
                    }
                }
                // tslint:disable-next-line: prefer-for-of
                for (
                    let i = 0;
                    i < response.DATA.standardData.docs?.length;
                    i++
                ) {
                    this.relaventData.push(response.DATA.standardData.docs[i]);
                }
                if (response.DATA.standardData.docs?.length > 0) {
                    this.pageNumberRelavent++;
                }
                if (isFirstLoad) {
                    this.infiniteScroll.complete().catch();
                }
                // this.presentLoading();
            },
            error => {
                // this.presentLoading();
            }
        );
    }
    releventOfUniversity(
        searchData: SearchModel,
        isFirstLoad: boolean,
        event: any
    ): void {
        const paginate: interfaces.IPaginate = {
            pageIndex: this.pageNumberRelavent,
            pageSize: this.pageLimitRelavent,
        };
        this.sharedService
            .releventOfUniversity(searchData, paginate)
            .subscribe(response => {
                if (response.DATA.docs?.length < 1) {
                    this.noRelavantData = true;
                }
                // tslint:disable-next-line: prefer-for-of
                for (let i = 0; i < response.DATA.docs?.length; i++) {
                    this.relaventData.push(response.DATA.docs[i]);
                }
                if (response.DATA.docs?.length > 0) {
                    this.pageNumberRelavent++;
                }
                if (isFirstLoad) {
                    this.infiniteScroll.complete().catch();
                }

                // this.presentLoading();
            });
    }
    releventOfExam(
        searchData: SearchModel,
        isFirstLoad: boolean,
        event: any
    ): void {
        const paginate: interfaces.IPaginate = {
            pageIndex: this.pageNumberRelavent,
            pageSize: this.pageLimitRelavent,
        };
        this.sharedService
            .releventOfExam(searchData, paginate)
            .subscribe(response => {
                if (response.DATA.docs?.length < 1) {
                    this.noRelavantData = true;
                }
                // tslint:disable-next-line: prefer-for-of
                for (let i = 0; i < response.DATA.docs?.length; i++) {
                    this.relaventData.push(response.DATA.docs[i]);
                }
                if (response.DATA.docs?.length > 0) {
                    this.pageNumberRelavent++;
                }
                if (isFirstLoad) {
                    this.infiniteScroll.complete().catch();
                }

                // this.presentLoading();
            });
    }

    relavent(
        searchData: SearchModel,
        isFirstLoad: boolean,
        event: any
    ): void {
        if (this.type === 'school') {
            this.releventOfSchool(searchData, isFirstLoad, event);
        } else if (this.type === 'board') {
            this.releventOfBoard(searchData, isFirstLoad, event);
        } else if (this.type === 'university') {
            this.releventOfUniversity(searchData, isFirstLoad, event);
        } else if (this.type === 'competition') {
            this.releventOfExam(searchData, isFirstLoad, event);
        }
    }

    addWishList(uuids: string, actions: string): void {
        this.loadingService.display(true);
        this.iconActive = true;
        const products = [];
        products.push({ productUUID: uuids });

        const wishlistParams = {
            products,
        };
        if (this.auth.currentGuestUserValue) {
            this.wishList.push({ uuid: uuids, action: actions });
        }
        if (this.auth.currentGuestUserValue) {
            this.loadingService.display(false);
            this.router.navigateByUrl('/tab/wishlist/' + Math.random()).catch();
            localStorage.setItem('back-route', '/product-list');
            return;
        }
        this.wishlistService.addWishList(wishlistParams).subscribe(res => {
            if (res) {
                if (actions === 'add') {
                    this.toast
                        .showToast('Product is added to wishlist', 'end')
                        .catch();
                } else if (actions === 'remove') {
                    this.toast
                        .showToast('Product is removed from wishlist', 'end')
                        .catch();
                }
                this.getWishList();
                this.loadingService.display(false);
            }
        });
    }

    getWishList(): void {
        this.wishlistService.getWishList().subscribe(res => {
            if (res.DATA) {
                this.wishListData = res.DATA;

                this.wishlistProductIds = this.wishListData.products.map(
                    e => e.productUUID
                );
            }
        });
    }

    isWishListed(uuid: string): boolean {
        if (this.wishlistProductIds.includes(uuid)) {
            return true;
        } else {
            return false;
        }
    }

    ProductCategoryFilter(
        uuid: string,
        subUuid: string,
        className: string,
        abbreviation: string,
        cateory_uuid: string,
    ): void {
        let searchData: SearchModel;
        searchData = {
            className,
            abbreviation,
            uuid,
            sub_uuid: subUuid,
            category_uuid: cateory_uuid
        };
        this.sharedService.ProductCategoryFilter(searchData).subscribe(
            response => {
                this.categoryFilter = response.DATA.docs;
            },
            error => {}
        );
    }
    openWishList(): void {
        this.router.navigateByUrl('/tab/wishlist/' + Math.random()).catch();
    }

    myCart(): void {
        this.router.navigateByUrl('/tab/cart/' + Math.random()).catch();
    }

    async presentActionSheet(): Promise<void> {
        const actionSheet = await this.actionSheetController.create({
            header: 'Sort By',
            cssClass: 'my-custom-class',
            buttons: [
                {
                    text: 'Price- Low to High',
                    icon: 'chevron-up',
                    handler: () => {
                        this.sort = 1;
                        this.pageNumber = 0;
                        this.productList = [];

                        this.sortProduct();
                    },
                },
                {
                    text: 'Price- High to Low',
                    icon: 'chevron-down',
                    handler: () => {
                        this.sort = -1;
                        this.pageNumber = 0;
                        this.productList = [];

                        this.sortProduct();
                    },
                },
                // {
                //     text: 'Cancel',
                //     icon: 'close',
                //     role: 'cancel',
                //     handler: () => {},
                // },
            ],
        });
        await actionSheet.present();
    }

    sortProduct(): void {
        // this.isDataLoaded = false;
        this.loadingService.display(true);
        if (
            (this.dashboardSearchType === 'category' ||
                this.type === 'Category') &&
            !this.selectedFilter.length
        ) {
            this.searchProductByCategory(this.categoryUUID, false, undefined);
        } else if (this.selectedFilter.length) {
            const searchData: SearchModel = {
                min: this.min,
                max: this.max,
                uuid: this.categoryUUID ? undefined : this.schoolUUID,
                sub_uuid: this.categoryUUID ? undefined : this.standardUUID,
                attribute_value: this.selectedFilter,
                category_uuid: this.categoryUUID,
                sort: this.sort,
                isDigital: this.isDigital,
            };
            this.search(searchData, false, undefined);
            //   this.loadingService.display(false);
        } else {
            const searchData = {
                min: this.min,
                max: this.max,
                uuid: this.categoryUUID ? undefined : this.schoolUUID,
                sub_uuid: this.categoryUUID ? undefined : this.standardUUID,
                category_uuid: this.categoryUUID,
                sort: this.sort,
                isDigital: this.isDigital,
            };
            this.search(searchData, false, undefined);
            // this.loadingService.display(false);
        }
    }

    sortProductCategory(): void {}

    loadData(event: any): void {
        if (
            (this.dashboardSearchType === 'category' ||
                this.type === 'Category') &&
            !this.selectedFilter
        ) {
            this.searchProductByCategory(this.params.uuid, true, event);
        }
        if (
            (this.dashboardSearchType === 'custom' || this.type === 'Custom') &&
            !this.selectedFilter
        ) {
            this.searchByDiscount((this.params as any).filter, true, event);
        } else if (this.type === 'Product') {
            this.sharedService
                .getCategoryData(this.filterApi)
                .subscribe(res => {
                    this.productList = [];
                    this.productList.push(
                        (res as unknown) as IProduct
                    );
                });
        } else if (this.historyState?.search_string) {
            if(this.filterApply) {
                let searchData = {
                  min: this.min,
                  max: this.max,
                  attribute_value: this.selectedFilter,
                  category_uuid: this.categoryUUID || "",
                  sort: this.sort,
                  search_string: this.historyState.search_string,
                };
                this.searchFilter(searchData, event);
            } else {
                this.searchByEnter(this.historyState?.search_string, false, false, event);
            }
        } else {
            let searchData;
            this.schoolUUID = this.params.uuid;
            this.standardUUID = this.params.sub_uuid;
            searchData = {
                min: this.min,
                max: this.max,
                uuid: this.categoryUUID ? undefined : this.schoolUUID,
                category_uuid: this.categoryUUID,
                sub_uuid: this.categoryUUID ? undefined : this.standardUUID,
                attribute_value: this.selectedFilter ? this.selectedFilter : [],
                isDigital: this.isDigital,
            };
            this.search(searchData, true, event);
        }
    }

    calculateOfferPercentage(
        mrp: number,
        sellingPrice: number
    ): string | number {
        return sellingPrice > mrp
            ? 0
            : (((mrp - sellingPrice) / mrp) * 100).toFixed();
    }

    productPage(product: interfaces.IProduct): void {
        this.navCtrl.navigateForward('/tab/product-page/' + Math.random(), {
            state: {
                params: this.params,
                uuid: this.params.uuid,
                sub_uuid: this.params.sub_uuid,
                product,
                isGrouped: product.is_grouped,
                state: this.state ? this.state : this.historyState,
            },
        });
    }

    async presentToast(): Promise<void> {
        const toast = await this.toastController.create({
            message: 'Product added to cart',
            duration: 2000,
        });
        toast.present().catch();
    }

    goback(): void {
        this.navCtrl.back();
    }

    async filter(): Promise<void> {
        const modal = await this.modalController.create({
            component: FilterModalComponent,
            cssClass: 'my-custom-class',
            componentProps: {
                categoryFilter: this.categoryFilter,
                Filter: this.selectedFilter,
                searchData: this.searchDataForFilter,
                categoryUUID: this.categoryUUID,
                min: this.min,
                max: this.max,
            },
        });

        modal
            .onDidDismiss()
            .then(data => {
                if (data["data"].dismissed === false) {
                  this.isDataLoaded = false;
                  this.loadingService.display(true);
                  this.infiniteScroll.disabled = false;
                    this.pageNumber = 0;
                  let searchData;
                  const paginate: interfaces.IPaginate = {
                    pageIndex: this.pageNumber + 1,
                    pageSize: this.pageLimit,
                  };
                  this.selectedFilter = data['data'].filter;
                  this.min = data['data'].min;
                  this.max = data['data'].max;
                  
                  if(this.searchDataForFilter){
                    searchData = {
                        min: data["data"]?.min,
                        max: data["data"]?.max,
                        attribute_value: data["data"].filter,
                        uuid: this.searchDataForFilter ? this.searchDataForFilter.uuid : "",
                        sub_uuid: this.searchDataForFilter ? this.searchDataForFilter.sub_uuid : "",
                        category_uuid: this.categoryUUID || "",
                        sort: this.sort,
                    };
                  } else {
                    searchData = {
                      min: data["data"]?.min,
                      max: data["data"]?.max,
                      attribute_value: data["data"].filter,
                      category_uuid: this.categoryUUID || "",
                      sort: this.sort,
                    };
                  }
                  if(this.historyState.search_string){
                    searchData.search_string = this.historyState.search_string;
                    this.filterApply = true;
                  }
                  this.searchFilter(searchData, paginate);
                  this.min = data["data"].min;
                  this.max = data["data"].max;
                }else {
                    this.productList = [];
                    this.pageNumber = 0;
                    this.selectedFilter = data['data']
                        ? data['data'].filter
                        : [];
                    this.filterApply = true;
                    this.ionViewWillEnter();
                }
            })
            .catch();
        return modal.present();
    }
    searchFilter(data: any, paginate: any) {
        this.sharedService.search(data, paginate).subscribe((response) => {
        this.productList = [];
        for (let i = 0; i < response.DATA.docs.length; i++) {
            this.productList.push(response.DATA.docs[i] as any);
        }
        this.isDataLoaded = true;
        this.loadingService.display(false);
        }, (error) => {
            this.isDataLoaded = true;
            this.loadingService.display(false);
        });
    }

    search(
        searchData: SearchModel,
        isFirstLoad: boolean,
        event: any
    ): void {
        searchData.sort = this.sort;
        const paginate: interfaces.IPaginate = {
            pageIndex: this.pageNumber + 1,
            pageSize: this.pageLimit,
        };
        this.sharedService.search(searchData, paginate).subscribe(
            response => {
                if (response.DATA) {
                    if (response.DATA.docs.length < 1) {
                        this.noData = true;
                        this.isDataLoaded = true;
                        if (
                            this.noData === true &&
                            this.noRelavantData === false
                        ) {
                        }
                        this.relavent(searchData, isFirstLoad, event);
                    }
                    if (response.DATA.docs.length > 0) {
                        this.isDataLoaded = false;

                        this.noData = false;
                    }
                    for (let i = 0; i < response.DATA?.docs.length; i++) {
                        this.productList.push(response.DATA.docs[i] as IProduct);
                    }

                    // if (this.productList?.length < 5) {
                    //     this.relavent(searchData, isFirstLoad, event);
                    // }
                } else {
                    this.isDataLoaded = true;
                }

                if (this.sections?.length > 0) {
                    const sectionsToLoad = 3;
                    for (
                        let index = 0;
                        index < this.sections.length;
                        index = index + sectionsToLoad - 1
                    ) {
                        this.collectionDATA.push(
                            this.sections.slice(
                                index,
                                index + sectionsToLoad - 1
                            )
                        );
                    }
                    if (this.pageNumber + 1 < this.sections.length) {
                        const observables: Observable<
                            interfaces.ICollection
                        >[] = [];
                        this.collectionDATA[this.pageNumber].forEach(a => {
                            observables.push(this.getCollectionById(a.uuid));
                        });
                        this.isSection = true;
                        // tslint:disable-next-line: deprecation
                        forkJoin(...observables).subscribe(res => {
                            res.forEach(cc => {
                                const collect = this.collectionDATA
                                    ? this.collectionDATA[
                                          this.pageNumber - 1
                                      ]?.filter(
                                          val => val.uuid === cc.DATA.uuid
                                      )
                                    : [];

                                this.dynamicSection.push({
                                    data: cc.DATA,
                                    viewType: collect?.length
                                        ? collect[0].viewType
                                        : '',
                                });
                            });
                            if (isFirstLoad) {
                                this.infiniteScroll.complete().catch();
                            }
                        });
                    }
                }
                if (isFirstLoad) {
                    this.infiniteScroll.complete();
                }
                if (!this.noData) {
                    this.pageNumber++;
                }
                // this.isDataLoaded = true;
                this.loadingService.display(false);
            },
            error => {
                this.loadingService.display(false);
            }
        );
    }

    onChipClose(i: number): void {
        this.chipArray.splice(i, 1);
    }

    searchByCategory(uuid: string): void {
        // this.presentLoading();

        let searchData;
        searchData = {
            uuid,
        };
        this.sharedService.searchByCategory(searchData).subscribe(response => {
            this.categoryFilter = response.DATA.docs;
        });
    }

    searchByDiscount(
        filter: string,
        isFirstLoad: boolean,
        event: any
    ): void {
        if (!isFirstLoad) {
            this.loadingService.display(true);
        }
        const paginate: interfaces.IPaginate = {
            pageIndex: this.pageNumber + 1,
            pageSize: this.pageLimit,
        };

        this.sharedService
            .searchProductByDiscount(filter, this.sort, paginate)
            .subscribe(
                response => {
                    //  this.productList = response.DATA.docs;
                    if (response) {
                        if (response.DATA.docs.length < 1) {
                            this.isDataLoaded = true;
                            this.noData = true;
                        }
                        // tslint:disable-next-line: prefer-for-of
                        for (let i = 0; i < response.DATA.docs.length; i++) {
                            this.productList.push(response.DATA.docs[i] as IProduct);
                        }
                        if (isFirstLoad) {
                            this.infiniteScroll.complete().catch();
                        }
                        if (response.DATA.docs.length > 0) {
                            this.isDataLoaded = false;
                            this.noData = false;
                            this.pageNumber++;
                        }
                    } else {
                        this.isDataLoaded = true;
                    }
                    this.loadingService.display(false);
                },
                error => {
                    this.loadingService.display(false);
                }
            );
    }

    searchProductByCategory(
        uuid: string,
        isFirstLoad: boolean,
        event: any
    ): void {
        if (!isFirstLoad) {
            this.loadingService.display(true);
        }
        const paginate: interfaces.IPaginate = {
            pageIndex: this.pageNumber + 1,
            pageSize: this.pageLimit,
        };

        this.sharedService
            .searchProductByCategory(uuid, this.sort, paginate)
            .subscribe(
                response => {
                    //  this.productList = response.DATA.docs;
                    if (response) {
                        if (response.DATA.docs.length < 1) {
                            this.isDataLoaded = true;
                            this.noData = true;
                        }
                        // tslint:disable-next-line: prefer-for-of
                        for (let i = 0; i < response.DATA.docs.length; i++) {
                            this.productList.push(response.DATA.docs[i] as IProduct);
                        }
                        if (isFirstLoad) {
                            this.infiniteScroll.complete().catch();
                        }
                        if (response.DATA.docs.length > 0) {
                            this.isDataLoaded = false;
                            this.noData = false;
                            this.pageNumber++;
                        }
                    } else {
                        this.isDataLoaded = true;
                    }
                    this.loadingService.display(false);
                },
                error => {
                    this.loadingService.display(false);
                }
            );
    }

    async presentModal(): Promise<void> {
        const modal = await this.modalController.create({
            component: SearchModalComponent,
            cssClass: 'my-custom-class',
            backdropDismiss: true,
        });
        return modal.present();
    }
}
