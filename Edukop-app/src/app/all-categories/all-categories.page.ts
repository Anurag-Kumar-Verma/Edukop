import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { ICategoryTreeResponse } from '@spundan-clients/bookz-interfaces';
import { RouteService } from '../shared/services/router.service';
import { LoaderService } from '../shared/loader/loader.service';

import { AllCategories } from './service/all-categories.service';

@Component({
    selector: 'app-all-categories',
    templateUrl: './all-categories.page.html',
    styleUrls: ['./all-categories.page.scss'],
})
export class AllCategoriesPage implements OnInit {
    openAll: boolean[] = [];
    openSub: boolean[] = [];
    searchOn: boolean = false;
    searchTerm: string;
    searchStr: string;
    searchkeyword: string;
    categoryTree: ICategoryTreeResponse[];
    categoryChild: ICategoryTreeResponse;
    type: string;
    uuid: string;
    action: string;
    subCategoryChild: ICategoryTreeResponse;
    sub: ICategoryTreeResponse;

    constructor(
        public categoryService: AllCategories,
        public navCtrl: NavController,
        public router: Router,
        public platform: Platform,
        public loaderService: LoaderService,
        public routerService: RouteService
    ) {
        // this.platform.backButton.subscribeWithPriority(9999, () => {
        //     this.navCtrl
        //         .navigateRoot('/tab/dashboard', {
        //             animationDirection: 'back',
        //         })
        //         .catch();
        // });
    }

    ngOnInit(): void {
        this.getCategories();
    }
    search(): void {
        this.searchOn = true;
    }

    openCategory(category: ICategoryTreeResponse): void {
        this.router
            .navigateByUrl('/tab/product-list/' + Math.random(), {
                state: {
                    type: 'category',
                    uuid: category.id,
                    name: category.name,
                },
            })
            .catch();
        localStorage.setItem('product-list-back', '/tab/all-categories');
    }

    addClicked(index: number): void {
        this.openAll[index] = true;
        this.categoryChild = this.categoryTree[index];
    }

    close(index: number): void {
        this.openAll[index] = false;
    }

    getCategories(): void {
        this.loaderService.display(true);
        this.categoryService.getCategoryTree().subscribe(
            res => {
                this.categoryTree = res;
                this.loaderService.display(false);
            },
            error => {
                this.loaderService.display(false);
            }
        );
    }

    goback(): void {
        this.routerService.navigateToBack('ionic');
    }

    subCategory(index: number): void {
        this.openSub[index] = true;
        this.subCategoryChild = this.categoryChild[index];
        if (this.subCategoryChild?.childs) {
            this.sub = this.subCategoryChild[index];
        }
    }

    closeSub(index: number): void {
        this.openSub[index] = false;
    }
}
