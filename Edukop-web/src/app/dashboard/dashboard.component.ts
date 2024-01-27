import { Component, OnInit } from "@angular/core";
import { NavigationExtras, Router } from "@angular/router";
import * as interfaces from "@spundan-clients/bookz-interfaces";
import { forkJoin, Observable, Subscription } from "rxjs";
import {
  Banner,
  Section,
  TopCategories,
  TopDeals,
} from "./models/category.model";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { environment } from "src/environments/environment";
import { NgxSpinnerService } from "ngx-spinner";
import { IBrowsingHistory } from "./models/IBrowsingHistory.model";
import { UserStateService } from "../shared/states/user-info.state";
import { AuthService } from "../auth/auth.service";
import { SharedService } from "../shared/services/shared.service";
import { DashboardService } from "../services/dashboard.service";
import { CategoryStateService } from "../shared/states/category.state";
import { CategoriesService } from "../services/categories.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  sectionSchool: any;
  scrollPage: number = 0;
  section: Section[] = [];
  recentProducts!: IBrowsingHistory;
  enrollmentCategory!: TopCategories;
  userState!: Subscription;
  userInfo!: interfaces.IUser;
  thumbApi: string = "";
  isGuest: boolean = true;

  throttle = 300;
  scrollDistance = 2;
  scrollUpDistance = 3;

  private readonly DASHBOARD_IDENTIFIER: string = "dashboard";
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
  }> = [];

  dynamicSection: Array<{
    data: interfaces.ICollection;
    viewType: string;
  }> = [];

  constructor(
    private router: Router,
    public dashboardService: DashboardService,
    private spinner: NgxSpinnerService,
    public userStateService: UserStateService,
    public authService: AuthService,
    public sharedService: SharedService,
    public categoryService: CategoriesService,
    public categoryStateService: CategoryStateService
  ) {}

  ngOnInit(): void {
    this.thumbApi = environment.thumbApi;
    if (!this.collections.length) {
      this.getSectionofCollection();
    }
    this.getUserState();
    this.getRecentProducts();
    this.getCategories();
  }

  getUserState(): void {
    this.userState = this.userStateService.getUserState().subscribe((val) => {
      // this.getUserInfo();
      this.isGuest = this.authService.currentGuestUserValue;
    });
  }

  getUserInfo(): void {
    this.sharedService.getUserInfo().subscribe((response) => {
      this.userInfo = response.DATA;
    });
  }

  getSectionofCollection(): void {
    this.spinner.show();
    this.dashboardService
      .getSectionofCollection(this.DASHBOARD_IDENTIFIER)
      .subscribe(
        (sections) => {
          if (sections) {
            this.collections = sections.DATA.collectionData;
            this.collections = this.collections.sort((a, b) =>
              Number(a.sequence) > Number(b.sequence) ? 1 : -1
            );
            this.dynamicSectionLoad(true);
            // this.spinner.hide();
          }
        },
        (error) => {
          this.spinner.hide();
        }
      );
  }

  dynamicSectionLoad(isFirstLoad: boolean) {
    const sectionsToLoad = 10;
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

      this.identifier[this.scrollPage].forEach((a) => {
        observables.push(this.getSection(a.uuid));
      });

      // tslint:disable-next-line: deprecation
      forkJoin(...observables).subscribe((res: any) => {
        res.forEach((cc: any) => {
          const collect = this.identifier[this.scrollPage].filter(
            (val) => val.uuid === cc.DATA.uuid
          );
          this.dynamicSection.push({
            data: cc.DATA,
            viewType: collect[0].viewType,
          });
        });

        this.scrollPage++;
      });
    } else {
    }
  }

  getSection(identifier: string): Observable<interfaces.ICollection> {
    return this.dashboardService.getCollectionById(identifier);
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
      $event.isRouterLink as boolean,
      $event.routerLink as string,
      $event.orgType as string
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
    // console.log(
    //   `action: ${action}\n type: ${type}\n uuid: ${uuid}\n name: ${name}\n isRouterLink: ${isRouterLink}\n routerLink: ${routerLink}\n orgType: ${orgType}`
    // );

    if (type === "Product") {
      const d1 = action + "?uuid=" + uuid;

      let navigationExtras: NavigationExtras = {
        queryParams: {
          product: JSON.stringify(uuid),
          filter: JSON.stringify(d1),
          type: JSON.stringify(type),
        },
      };

      this.router.navigate(
        [`/product-detail/${Math.random()}`],
        navigationExtras
      );
      // this.router.navigateByUrl("/product-detail/" + Math.random(), {
      //   state: { filter: d1, type, uuid },
      // })
      // .catch();
    } else if (type === "Category") {
      this.router
        .navigateByUrl("/product-list/" + Math.random(), {
          state: {data: { filter: action, uuid, type }},
        })
        .catch();
    } else if (type === "School") {
      this.createModal(uuid, type, action, name);
    } else if (type === "University") {
      this.createModal(uuid, type, action, name);
    } else if (type === "Board") {
      this.createModal(uuid, type, action, name);
    } else if (type === "Custom") {
      if (isRouterLink) {
        this.router
          .navigateByUrl(routerLink, {
            state: {
              type: orgType,
              filter: action,
              uuid: "category?.uuid",
            },
          })
          .catch();
      } else {
        this.router
          .navigateByUrl("/product-list/" + Math.random(), {
            state: {data: { filter: action, uuid, type }},
          })
          .catch();
      }
    }
  }

  openBanners(banners: Banner): void {
    this.router
      .navigateByUrl("/product-list/" + Math.random(), {
        state: {data: { filter: banners }},
      })
      .catch();
  }

  createModal(
    uuid: string,
    types: string,
    modalAction: string,
    nameI: string
  ): void {
    // console.log(
    //   "uuid: ",
    //   uuid,
    //   "\ntypes: ",
    //   types,
    //   "\nmodalAction: ",
    //   modalAction,
    //   "\nNameI: ",
    //   nameI
    // );
    let navigationExtras: NavigationExtras = {
      queryParams: {
        type: JSON.stringify(types),
        name: JSON.stringify(nameI),
        modalAction: JSON.stringify(modalAction),
        abbreviation: JSON.stringify('')
      },
    };

    this.router
      .navigate([`/side/child-categories/${uuid}`], navigationExtras)
      .catch();
  }

  getRecentProducts(): void {
    this.dashboardService.getRecentProducts().subscribe((res) => {
      this.recentProducts = res.DATA as IBrowsingHistory;
    });
  }

  recentlyViewedProducts(event: Event, productId: string): void {
    event.stopPropagation();

    let navigationExtras: NavigationExtras = {
      queryParams: {
        product: JSON.stringify(productId),
        filter: JSON.stringify('productById?uuid='+productId),
        type: JSON.stringify('Product'),
      },
    };

    this.router.navigate(
      [`/product-detail/${Math.random()}`],
      navigationExtras
    );
  }

  openCategory(category: any): void {

    let navigationExtras: NavigationExtras = {
      queryParams: {
        filter: JSON.stringify(category.filter),
        type: JSON.stringify(category.type),
        uuid: JSON.stringify(category?.uuid)
      },
    };

    this.router.navigate([`/side/sub-categories`], navigationExtras);
  }

  openCategoryEvent(category: any): void {
    this.openCategory(category.category);
  }

  onScrollDown() {
    this.dynamicSectionLoad(false);
  }

  calculateOfferPercentage(mrp: number, sellingPrice: number): string | number {
    return sellingPrice > mrp
      ? 0
      : (((mrp - sellingPrice) / mrp) * 100).toFixed();
  }

  getCategories(): void {
    this.spinner.show();
    this.categoryService.getCategoryTree().subscribe(
      (res) => {
        this.spinner.hide();
        this.categoryStateService.setCategoryState(res);
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }
}
