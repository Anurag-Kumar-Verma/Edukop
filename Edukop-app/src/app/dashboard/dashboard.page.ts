import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
    IonInfiniteScroll,
    MenuController,
    ModalController,
    NavController,
    Platform,
} from '@ionic/angular';
import * as interfaces from '@spundan-clients/bookz-interfaces';
import { Observable, forkJoin, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

import { AllCategories } from '../all-categories/service/all-categories.service';
import { AuthService } from '../auth/services/auth.service';
import { SubCategoryService } from '../sub-category/services/sub-categories.service';
import { SearchModalComponent } from '../search-modal/search-modal.component';
import { LoaderService } from '../shared/loader/loader.service';
import { SharedService } from '../shared/services/shared.service';
import { ToastService } from '../shared/services/toast.service';
import { CartStateService } from '../shared/state/cart.state';
import { CategoryStateService } from '../shared/state/category.state';
import { UserStateService } from '../shared/state/user-info.state';
import { WishlistService } from '../wishlist/service/wishlist.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import {
    Banner,
    Section,
    TopCategories,
    TopDeals,
} from './models/category.model';
import { DashboardService } from './service/dashboard.service';
import { logoImageBase64 } from './constant/imageBase64';
import { StringMap } from '@angular/compiler/src/compiler_facade_interface';
import { IProduct } from '../models/IProduct.model';
import { IBrowsingHistory } from '../models/IBrowsingHistory.model';
@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.page.html',
    styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit, OnDestroy {
    @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
    isGuest: boolean;
    categoryTree: interfaces.ICategoryTreeResponse[];
    userState: Subscription;
    deals: TopDeals[];
    imageApi: string;
    section: Section[];
    userInfo: interfaces.IUser;
    cartBadge: number = 0;
    recentProducts: IBrowsingHistory;
    isLoading: boolean = false;
    iconActive: boolean = false;
    wishListData: interfaces.IWishlist;
    isExitCount: number = 1;
    currentUrl: string;
    thumbApi: string;
    scrollPage: number = 0;
    identifier: Array<
        Array<{
            uuid: string;
            viewType: string;
            sequence: string;
        }>
    > = [];
    collections: Array<{
        uuid: string;
        viewType: string;
        sequence: string;
    }>;

    private readonly DASHBOARD_IDENTIFIER: string = 'dashboard';
    dynamicSection: Array<{
        data: interfaces.ICollection;
        viewType: string;
    }> = [];

    wishlistProductIds: string[] = [];
    enrollmentCategory: TopCategories;
    constructor(
        private modalController: ModalController,
        public menuController: MenuController,
        public authService: AuthService,
        public router: Router,
        public loadingService: LoaderService,
        public dashboardService: DashboardService,
        public boardService: SubCategoryService,
        public sharedService: SharedService,
        public cartStateService: CartStateService,
        public modelController: ModalController,
        public wishlistService: WishlistService,
        public platform: Platform,
        public toast: ToastService,
        private navCtrl: NavController,
        public userStateService: UserStateService,
        public categoryService: AllCategories,
        public categoryStateService: CategoryStateService,
        private socialSharing: SocialSharing
    ) {
        this.imageApi = environment.imageApi;
        this.thumbApi = environment.thumbApi;
    }
    ngOnInit(): void {
        this.getCarts();
    }

    ionViewWillEnter(): void {
        // this.loadingService.presentLoading();
        this.cartState();
        if (!this.collections) {
            this.getSectionofCollection();
        }
        this.menuController.close().catch();
        this.getWishList();
        this.getRecentProducts();
        this.getUserState();
        this.getCategories();
    }

    ionViewWillLeave(): void {
        this.userState.unsubscribe();
    }
    private cartState(): void {
        this.cartStateService.getCartState().subscribe(val => {
            if (val !== undefined) {
                this.cartBadge = val;
            } else {
                // this.getCarts();
            }
        });
    }

    private getUserState(): void {
        this.userState = this.userStateService.getUserState().subscribe(val => {
            if (val !== undefined) {
                this.isGuest = this.authService.currentGuestUserValue;
                this.getUserInfo();
            } else {
                this.getUserInfo();
                this.isGuest = this.authService.currentGuestUserValue;
            }
        });
    }

    categoryPage(): void {
        // this.router.navigateByUrl('/all-categories').catch();
        this.router.navigateByUrl('/tab/all-categories');
    }

    getSectionofCollection(): void {
        this.loadingService.display(true);
        this.dashboardService
            .getSectionofCollection(this.DASHBOARD_IDENTIFIER)
            .subscribe(
                sections => {
                    if (sections) {
                        this.collections = sections.DATA.collectionData;
                        this.collections = this.collections.sort((a, b) =>
                            Number(a.sequence) > Number(b.sequence) ? 1 : -1
                        );
                        this.infiniteScrollLoader(false, undefined);
                    }
                },
                error => {
                    this.loadingService.display(false);
                }
            );
        // setTimeout(() => {
        //     this.loadingService.loadingDismiss();
        // }, 3000);
    }

    getCollectionById(id: string): void {
        this.dashboardService.getCollectionById(id).subscribe(res => {});
    }

    createModal(
        uuid: string,
        types: string,
        modalAction: string,
        nameI: string
    ): void {
        //localStorage.setItem('child-category-back', '/tab/dashboard');
        this.router
            .navigateByUrl('/tab/child-category/' + Math.random(), {
                state: {
                    categoryData: uuid,
                    type: types,
                    action: modalAction,
                    name: nameI,
                },
            })
            .catch();
    }

    getCarts(): void {
        this.dashboardService.getCart().subscribe(res => {
            if (res.DATA !== undefined && res.DATA !== null) {
                this.cartBadge = res.DATA.products.length;
                this.cartStateService.setCartState(this.cartBadge);
            }
        });
    }

    getRecentProducts(): void {
        this.dashboardService.getRecentProducts().subscribe(res => {
            this.recentProducts = res.DATA as any;
        });
    }

    wishList(): void {
        this.router.navigateByUrl('/tab/wishlist/' + Math.random()).catch();
        localStorage.setItem('back-route-wishlist', '/tab/dashboard');
    }
    ngOnDestroy(): void {}

    openCategory(category: any): void {
        this.router
            .navigateByUrl(category.routerLink + Math.random(), {
                state: {
                    type: category.type,
                    filter: category.filter,
                    uuid: category?.uuid,
                    routerLink: category.routerLink,
                },
            })
            .catch();
    }

    openCategoryEvent(category: any): void {
        this.openCategory(category.category);
    }

    openSectionProductEvent($event: {
        action: string;
        typo: string;
        uuid: string;
        name: string;
        isRouterLink?: boolean;
        routerLink?: string;
        orgType?: string;
    }): void {
        this.openSectionProduct(
            $event.action,
            $event.typo,
            $event.uuid,
            $event.name,
            $event.isRouterLink,
            $event.routerLink,
            $event.orgType
        );
    }
    openSectionProduct(
        action: string,
        type: string,
        uuid: string,
        name: string,
        isRouterLink: boolean,
        routerLink: string,
        orgType: string
    ): void {
        if (type === 'Product') {
            const d1 = action + '?uuid=' + uuid;
            localStorage.setItem('back-route', '/tab/dashboard');
            this.router
                .navigateByUrl('/tab/product-page/' + Math.random(), {
                    state: { filter: d1, type, uuid },
                })
                .catch();
        } else if (type === 'Category') {
            this.router
                .navigateByUrl('/tab/product-list/' + Math.random(), {
                    state: { filter: action, uuid, type },
                })
                .catch();
            localStorage.setItem('product-list-back', '/tab/dashboard');
        } else if (type === 'School') {
            this.createModal(uuid, type, action, name);
        } else if (type === 'University') {
            this.createModal(uuid, type, action, name);
        } else if (type === 'Board') {
            this.createModal(uuid, type, action, name);
        } else if (type === 'Custom') {
            if (isRouterLink) {
                this.router
                    .navigateByUrl(routerLink, {
                        state: {
                            type: orgType,
                            filter: action,
                            uuid: 'category?.uuid',
                        },
                    })
                    .catch();
                localStorage.setItem('product-list-back', '/tab/dashboard');
            } else {
                this.router
                    .navigateByUrl('/tab/product-list/' + Math.random(), {
                        state: { filter: action, uuid, type },
                    })
                    .catch();
                localStorage.setItem('product-list-back', '/tab/dashboard');
            }
        }
    }
    closeMenu(): void {
        this.menuController.close().catch();
    }

    openDownloadedPage(): void {
        this.router.navigateByUrl('tab/downloaded/' + Math.random());
    }
    requestProduct() {
        this.router.navigateByUrl('tab/request-product/' + Math.random());
    }
    shareApp() {
        this.socialSharing.share(
            'Hey there !\nInstall for interesting offers on edukop.com Start shopping books and stationery now.\nFollow us on Intagram: https://www.instagram.com/edu.kop/ \nDownload from here :- ',
            'Share edukop.com',
            logoImageBase64,
            'https://play.google.com/store/apps/details?id=com.edukop.app'
        );
        // const a={
        //     text: 'Hello World',
        //     title: 'Title',
        //     url: 'stringUrl'
        // }
        // navigator.share(a)
        //   .then(() => console.log('Successful share'),
        //    error => console.log('Error sharing:', error));
    }

    ionViewDidEnter(): void {
        //   this.loadingService.display(true);
        localStorage.removeItem('child-category');
        localStorage.removeItem('sub-categories');
    }

    getUserInfo(): void {
        this.sharedService.getUserInfo().subscribe(response => {
            this.userInfo = response.DATA;
        });
    }

    openBanners(banners: Banner): void {
        this.router
            .navigateByUrl('/tab/product-list/' + Math.random(), {
                state: { filter: banners },
            })
            .catch();
    }

    calculateOfferPercentage(
        mrp: number,
        sellingPrice: number
    ): string | number {
        return sellingPrice > mrp
            ? 0
            : (((mrp - sellingPrice) / mrp) * 100).toFixed();
    }

    openBoard(): void {
        this.router.navigateByUrl('/tab/sub-categories/' + Math.random()).catch();
    }
    login() {
        this.router.navigateByUrl('/tab/login');
    }

    recentlyViewedProducts(event: Event, product: IProduct): void {
        event.stopPropagation();
        event.preventDefault();
        this.router
            .navigateByUrl('/tab/product-page/' + Math.random(), {
                state: { product },
            })
            .catch();
        localStorage.setItem('back-route', '/tab/dashboard');
    }

    home(): void {
        this.navCtrl.navigateRoot('/tab/dashboard').catch();
    }
    myOrders(): void {
        this.router.navigateByUrl('/tab/my-orders').catch();
    }
    myCart(): void {
        this.router.navigateByUrl('/tab/cart/' + Math.random()).catch();
        localStorage.setItem('route', '/tab/dashboard');
        localStorage.setItem('cart-back', '/tab/dashboard');
    }
    myAccount(): void {
        this.router.navigateByUrl('/tab/my-account').catch();
    }
    openEnrollmentForms(): void {
        this.router
            .navigateByUrl('/tab/form-list/' + Math.random(), {
                state: {
                    lastRoute: '/tab/dashboard',
                    category: this.enrollmentCategory,
                },
            })
            .catch();
    }
    onLogout(): void {
        this.authService.logout();
        // this.router.navigateByUrl("/login");
        this.menuController.close().catch();
    }

    addWishList(event: Event, uuid: string, action: string): void {
        event.stopPropagation();
        event.preventDefault();
        this.iconActive = true;
        const products = [];
        products.push({ productUUID: uuid });

        const wishlistParams = {
            products,
        };
        this.wishlistService.addWishList(wishlistParams).subscribe(res => {
            if (res) {
                if (action === 'add') {
                    this.toast
                        .showToast('Product is added to wishlist', 'end')
                        .catch();
                } else if (action === 'remove') {
                    this.toast
                        .showToast('Product is removed from wishlist', 'end')
                        .catch();
                }
                this.getWishList();
            }
        });
    }
    getWishList(): void {
        this.wishlistService.getWishList().subscribe(res => {
            if (res?.DATA) {
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

    doInfinite(event: any): void {
        this.infiniteScrollLoader(true, event);
    }

    infiniteScrollLoader(isFirstLoad: boolean, event: IonInfiniteScroll): void {
        const sectionsToLoad = 4;
        for (
            let index = 0;
            index < this.collections.length;
            index = index + sectionsToLoad - 1
        ) {
            this.identifier.push(
                this.collections.slice(index, index + sectionsToLoad - 1)
            );
        }
        if (this.scrollPage * sectionsToLoad <= this.collections.length) {
            const observables: Observable<interfaces.ICollection>[] = [];
            this.identifier[this.scrollPage].forEach(a => {
                observables.push(this.getSection(a.uuid));
            });

            // tslint:disable-next-line: deprecation
            forkJoin(...observables).subscribe(res => {
                res.forEach(cc => {
                    const collect = this.identifier[this.scrollPage].filter(
                        val => val.uuid === cc.DATA.uuid
                    );
                    this.dynamicSection.push({
                        data: cc.DATA,
                        viewType: collect[0].viewType,
                    });
                });
                if (isFirstLoad) {
                    this.infiniteScroll.complete().catch();
                }
                if (!isFirstLoad) {
                    this.loadingService.display(false);
                }
                this.scrollPage++;
            });
        } else {
            this.infiniteScroll.disabled = true;
        }
    }
    openAllCategory(): void {
        this.router.navigateByUrl('/tab/all-categories').catch();
    }

    termsOfUse(): void {
        this.router.navigateByUrl('/tab/terms-of-use').catch();
    }

    privacyPolicy(): void {
        this.router.navigateByUrl('/tab/privacy-policy').catch();
    }
    support(): void {
        this.router.navigateByUrl('/tab/support').catch();
    }
    newsFeed(){
        this.router.navigateByUrl('/tab/news-section/' + Math.random()).catch();
    }

    getSection(identifier: string): Observable<interfaces.ICollection> {
        return this.dashboardService.getCollectionById(identifier);
    }

    getCategories(): void {
        // this.loadingService.display(true);
        this.categoryService.getCategoryTree().subscribe(
            res => {
                this.categoryStateService.setCategoryState(res);
                // this.categoryTree = res;
                // localStorage.setItem('dynamicCategory', JSON.stringify(res));
                // this.loadingService.display(false);
            },
            error => {
                // this.loadingService.display(false);
            }
        );
    }
}
