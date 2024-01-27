import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import * as interfaces from '@spundan-clients/bookz-interfaces';
import { environment } from 'src/environments/environment';

import { LoaderService } from '../shared/loader/loader.service';
import { RouteService } from '../shared/services/router.service';
import { ToastService } from '../shared/services/toast.service';
import { WishlistProduct } from './model/wishList.model';

import { WishlistService } from './service/wishlist.service';

@Component({
    selector: 'app-wishlist',
    templateUrl: './wishlist.page.html',
    styleUrls: ['./wishlist.page.scss'],
})
export class WishlistPage implements OnInit {
    wishList: WishlistProduct[];
    uuid: string;
    isLoading: boolean = true;
    isExitCount: number = 1;
    imageApi: string;
    constructor(
        public wishlistService: WishlistService,
        public loadingService: LoaderService,
        private router: Router,
        public navCtrl: NavController,
        public alertController: AlertController,
        public toastService: ToastService,
        public routeService: RouteService
    ) {}

    ngOnInit(): void {
        this.imageApi = environment.thumbApi;
        this.getWishList();
    }
    goback(): void {
        this.routeService.navigateToBack('ionic');
        // localStorage.removeItem('back-route-wishlist');
        // this.navCtrl.back();
    }

    productPage(product: interfaces.IProduct): void {
        localStorage.setItem('back-route', '/wishlist');
        this.router
            .navigateByUrl('/tab/product-page/' + Math.random(), {
                state: {
                    product,
                },
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
    addWishList(uuid: string): void {
        const product: interfaces.IWishlistProduct[] = [];
        product.push({ productUUID: uuid });

        const wishListParams: interfaces.IWishlist = {
            products: product,
        };
        this.wishlistService.addWishList(wishListParams).subscribe(res => {
            if (res) {
                this.toastService
                    .showToast('Product is removed from wishlist', 'end')
                    .catch();
                this.getWishList();
            }
        });
    }

    getWishList(): void {
        this.loadingService.display(true);
        this.wishlistService.getWishList().subscribe(
            res => {
                if (res) {
                    this.loadingService.display(false);
                    if (res.DATA) {
                        this.wishList = res.DATA.products;
                    }
                    this.isLoading = false;
                }
            },
            error => {
                this.loadingService.display(false);
            }
        );
    }
}
