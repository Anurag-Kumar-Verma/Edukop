import { Component, OnInit } from "@angular/core";
import { NavigationExtras, NavigationStart, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { SharedService } from "../services/shared.service";
import { UserStateService } from "../states/user-info.state";
import * as interfaces from "@spundan-clients/bookz-interfaces";
import { CartStateService } from "../states/cart.state";
import { DashboardService } from "src/app/services/dashboard.service";
import { NgxSpinnerService } from "ngx-spinner";
import { SearchService } from "src/app/services/searchService.service";
import { environment } from "src/environments/environment";
import { ISchool } from "src/app/model/ISchool.model";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent implements OnInit {
  isGuest!: boolean;
  userState!: Subscription;
  userInfo!: interfaces.IUser;
  cartBadge!: number;
  search: string = '';
  isEnterPress: boolean = false;

  searchData: any[] = [];
  recentSearch: string[] = [];
  recentSearchData: string[] = [];
  type: string = "";
  imageApi = environment.thumbApi;
  activeRoute: string = '';

  constructor(
    public router: Router,
    private authService: AuthService,
    public userStateService: UserStateService,
    public cartStateService: CartStateService,
    public sharedService: SharedService,
    public dashboardService: DashboardService,
    public searchService: SearchService,
    private spinner: NgxSpinnerService
  ) {
    this.router.events.subscribe(event => {
      if(event instanceof NavigationStart) {
        this.activeRoute = event.url.split('?')[0];
      }
    });
  }

  ngOnInit(): void {
    this.getUserState();
  }

  getUserState(): void {
    this.userState = this.userStateService.getUserState().subscribe((val) => {
      this.isGuest = this.authService.currentGuestUserValue;
      console.log(val)
      // if(val != null){
        this.getUserInfo();
        this.getCarts();
      // }
    });
  }
  
  getCarts(): void {
    this.dashboardService.getCart().subscribe((res) => {
      if (res.DATA !== undefined && res.DATA !== null) {
        this.cartBadge = res.DATA.products?.length as number;
        this.cartStateService.setCartState(this.cartBadge);
        this.cartState();
      }
    });
  }

  cartState() {
    this.cartStateService.getCartState().subscribe((res) => {
      this.cartBadge = res;
    });
  }

  getUserInfo(): void {
    this.sharedService.getUserInfo().subscribe((response) => {
      this.userInfo = response.DATA;
    });
  }

  login() {
    this.authService.logout();
  }
  
  wishlist(){
    this.router.navigate([`/side/wishlist`]);
  }

  cart(){
    this.router.navigate([`/my-cart`]);
  }

  home(){
    if(!this.isGuest) {
      this.router.navigate([`/dashboard`]);
    } else {
      this.router.navigate([`/login`]);
    }
  }

  // for search -------------------------

  searchByEnter(searchTxt: string) {
    const event = {
      keyCode: 13,
      target: {
        value: searchTxt
      }
    }
    this.searchItem(event);
  }

  searchItem(event: any) {
    this.search = event.target.value;
    if (event.keyCode === 13) {
      this.isEnterPress = true;
      if(this.activeRoute.search("/product-list/") != -1){
        window.location.replace(`/product-list/${this.search}`);
        console.log(window.location);
      } else {
      this.router.navigate(["/product-list/" + this.search]);
      }
      this.searchData = [];
      this.isEnterPress = false;
    }
    
    else {
      if(this.search.length && this.search.length > 2){
        this.getProducts();
      }
      this.searchData = [];
    }
    this.search = '';
  }

  getProducts(): void {
    this.searchData = [];
    let searchData: object;

    if (this.search !== "") {
      this.spinner.show();
      if (this.recentSearchData) {
        this.recentSearch = this.recentSearchData.filter((name) => {
          return name.includes(this.search);
        });
      }
      if (this.type.length > 0) {
        searchData = {
          search_string: this.search || "",
          type: this.type,
        };
        this.searchService.categorySearch(searchData).subscribe(
          (response) => {
            if (response.DATA !== undefined && response.DATA.length > 0) {
              this.searchData = response.DATA;
            }
          },
          (error) => {}
        );
      } else {
        searchData = {
          search_string: this.search || "",
        };

        this.searchService.search(searchData).subscribe(
          (response) => {
            response.DATA.map((data) => {
              if (data.docs) {
                data.docs.map((doc) => {
                  this.searchData.push(doc);
                });
              } else {
              }
            });
            // if (this.isEnterPress) {
            //   this.router.navigateByUrl("/product-list/" + this.search, {
            //     state: { search_string: this.search },
            //   })
            //   .catch();
            //   this.searchData = [];
            //   this.isEnterPress = false;
            // }
          },
          (error) => {}
        );
      }
    } else {
      this.searchData = [];
      this.recentSearch = this.recentSearchData;
    }
    this.spinner.hide();
  }

  onSelect(
    product:
      | interfaces.IProduct
      | interfaces.IUniversity
      | interfaces.ISchool
      | any
  ): void {
    const productArray: (
      | interfaces.IProduct
      | interfaces.IUniversity
      | interfaces.ISchool
      | any
    )[] = [];

    if (
      this.type !== "" &&
      (this.type == "school" ||
      this.type == "board" ||
      this.type == "university" ||
      this.type == "novel")
    ) {
      productArray.push(product);
    } else {
      product = product as (interfaces.IProduct | interfaces.IUniversity | interfaces.ISchool | any);
      if (product.isType === "product") {
        const d1 = "productById?uuid=" + product.uuid;
        let navigationExtras: NavigationExtras = {
          queryParams: {
            product: JSON.stringify(product.uuid),
            filter: JSON.stringify(d1),
            type: JSON.stringify("Product"),
          },
        };
  
        this.router.navigate(
          [`/product-detail/${Math.random()}`],
          navigationExtras
        );
      } else if (product.isType === "category") {
        const data = {
          uuid: (product as interfaces.ICategory).category_uuid,
          type: "category",
        };
        this.router
          .navigateByUrl("/product-list/" + data.uuid, {
            state: { data },
          })
          .catch();
      } else if (product.isType === "school" || product.isType === "university") {
        let navigationExtras: NavigationExtras = {
          queryParams: {
            type: JSON.stringify(product.isType),
            name: JSON.stringify(product.name),
            modalAction: JSON.stringify(""),
            abbreviation: JSON.stringify(product.abbreviation || null),
          },
        };

        // window.location.href = `/side/child-categories/${product.uuid}?type="${product.isType}"&name="${product.name}"&modalAction=""&abbreviation="${product.abbreviation || null}"`;
        this.router.navigate([`/side/child-categories/${product.uuid}`], navigationExtras).catch();
      } else {
        // this.modelController.dismiss([product], product.name, "search").catch();
        return;
      }
      this.search = '';
    }

    this.searchData = [];
  }

}
