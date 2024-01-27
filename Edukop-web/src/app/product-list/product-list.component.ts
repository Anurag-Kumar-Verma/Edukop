import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import * as interfaces from "@spundan-clients/bookz-interfaces";
import { Section } from "../dashboard/models/category.model";
import { environment } from "src/environments/environment";
import { filter, forkJoin, Observable } from "rxjs";
import { DashboardService } from "../services/dashboard.service";
// import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { FlatTreeControl } from "@angular/cdk/tree";
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from "@angular/material/tree";
import { MatCheckbox, MatCheckboxChange } from "@angular/material/checkbox";
import { SharedService } from "../shared/services/shared.service";
import { FormGroup } from "@angular/forms";
import { IProduct } from "../model/product.model";
import { MatRadioChange } from "@angular/material/radio";
import { NgxSpinnerService } from "ngx-spinner";
import { WishlistService } from "../services/wishlist.service";
import { Wishlist, WishlistProduct } from "../wishlist/model/wishlist.model";
import { AuthService } from "../auth/auth.service";
import { ToastrService } from "ngx-toastr";
import { WishlistData } from "../product-detail/product-detail.component";
import { MatSlider, MatSliderChange } from "@angular/material/slider";
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
  uuid?: string;
  sub_uuid?: string;
  category_uuid?: string;
  attribute_value?: string[];
  isDigital?: string;
  min?: number;
  max?: number;
}

export interface Range {
  lower: number;
  upper: number;
}
@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.scss"],
})
export class ProductListComponent implements OnInit {
  @ViewChild(MatSlider) priceSlider!: MatSlider;
  
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

  rate: number = 3;
  productList: IProduct[] = [];
  filterApi!: string;
  categoryFilter!: interfaces.IAttribute[];
  params!: NavigationState;
  uuid!: string;
  historyState: any;
  pageNumber: number = 1;
  pageLimit: number = 20;
  state!: NavState;
  selectedFilter: string[] = [];
  section: Section[] = [];
  wishListData!: Wishlist;
  wishlistProductIds: string[] = [];
  wishList: WishlistData[] = [];
  dashboardSearchType!: string;
  sections: Array<{
    uuid: string;
    viewType: string;
    sequence: string;
  }> = [];
  collectionDATA: Array<
    Array<{
      uuid: string;
      viewType: string;
      sequence: string;
    }>
  > = [];
  className!: string;
  name!: string;
  type!: string;
  sort!: number;
  isDataLoaded!: boolean;
  noData!: boolean;
  infiniteScroll: any;
  schoolUUID!: string;
  standardUUID!: string;
  min: number = 0;
  max: number = 10000;
  categoryUUID: any;
  isDigital: any;
  thumbApi!: string;
  pageNumberRelavent: number = 1;
  pageLimitRelavent: number = 10;
  noRelavantData: boolean = false;
  relaventData: IProduct[] = [];
  scrollPage!: number;
  typeFilter: boolean = false;
  allCheck: boolean = false;
  price: boolean = false;
  Filter!: string[];
  isClicked: boolean[] = [false];
  attributeValue: interfaces.IAttributeValues[] | undefined;
  options: string[] = ["One", "Two", "Three"];
  filteredState: any;
  filterApply: boolean = false;
  chipArray: string[] = [];
  abbreviation!: string;
  searchDataForFilter!: SearchModel;
  sort_by!: number;
  imageApi = environment.imageApi;
  isSection: boolean = false;
  
  throttle = 300;
  scrollDistance = 2;
  scrollUpDistance = 3;

  searchText: string = ''
  knobValues: Range = {
    lower: 0,
    upper: 0,
  };
  priceRange: boolean = false;
  isFilter: boolean = false;
  filterToggleTxt: string = '';
  oldUuid!: string;
  newUuid!: string;
  variantImage: any;

  constructor(
    public router: Router,
    private sharedService: SharedService,
    private dashboardService: DashboardService,
    private spinner: NgxSpinnerService,
    public wishlistService: WishlistService,
    public authService: AuthService,
    public toaster: ToastrService,
    private route: ActivatedRoute
  ) {
    let _id = this.route.snapshot.paramMap.get("id") as any;
    if(isNaN(_id)){
      this.searchText = this.route.snapshot.paramMap.get("id") as string;
    } else {
      this.searchText = '';
    }
  }

  ngOnInit(): void {
    if (this.selectedFilter.length > 0) {
      return;
    }
    if (
      history?.state?.uuid ||
      history?.state?.data ||
      this.searchText ||
      history?.state?.search_string ||
      history?.state?.type === "Custom"
    ) {
      localStorage.setItem("product-list", JSON.stringify(history.state));
      this.historyState = history.state;
    }
    this.historyState = localStorage.getItem("product-list")
      ? JSON.parse(localStorage.getItem("product-list")!)
      : "";
    // this.cartStateService.getCartState().subscribe(val => {
    //     this.cartBadge = val;
    // });
    this.isDigital = this.historyState.data?.isDigital ? this.historyState.data?.isDigital : false;

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
      const localState: string = localStorage.getItem("state")!;

      if (localState !== undefined) {
        this.state = JSON.parse(localState);
      }

      if (!this.state) {
        this.filterApi = this.historyState.filter;
        this.type = history.state.data?.type || this.historyState?.type;
        this.name = history.state.data?.name || this.historyState?.name;
        this.className = history.state.data?.className || this.historyState?.name;
        this.uuid = history.state.data?.uuid || this.historyState?.uuid;
      } else {
        if (this.state?.navigationId !== "") {
          this.filterApi = this.state.filter;
          this.name = history.state.data?.type || this.historyState?.name;
          this.type = history.state.data?.name || this.state?.type;
          this.className = history.state.data?.className || this.historyState?.name;
          this.uuid = history.state.data?.uuid || this.state?.uuid;
        }
      }
    }
    this.dashboardSearchType = this.params.type;
    this.type = this.params.type;
    
    if (this.dashboardSearchType === "category" || this.type === "Category") {
      this.categoryUUID = this.params.uuid;
      this.searchByCategory(this.params.uuid);

      this.searchProductByCategory(this.params.uuid, true);
    } else if (this.dashboardSearchType === "custom" || this.type === "Custom") {
      this.searchByDiscount((this.params as any).filter, true);
    } else if (this.searchText || this.historyState?.search_string) {
      this.chipArray.push(this.searchText || this.historyState?.search_string);
      this.searchFilterByEnter(this.searchText || this.historyState?.search_string, false, true);
      this.searchByEnter(this.searchText || this.historyState?.search_string, false, true);
    } else {
      this.ProductCategoryFilter(
        this.params.uuid,
        this.params.sub_uuid,
        this.params.className,
        this.params.abbreviation,
        this.params.category_uuid
      );

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
      
      this.ProductCategoryFilter(
        this.params.uuid,
        this.params.sub_uuid,
        this.params.className,
        this.params.abbreviation,
        this.params.category_uuid
      );

      if(this.type){
        this.getSection(this.type.toLowerCase());
      }
    }
    
    if (this.type === "Product") {
      this.sharedService.getCategoryData(this.filterApi).subscribe((res) => {
        res = res as IProduct;
        this.productList = [];
        this.productList.push(res as IProduct);
      });
    }
  }

  isShow: boolean = false;
  isSort: boolean = false;

  searchData() {
    this.chipArray.push(this.searchText || this.historyState?.search_string);
    this.searchFilterByEnter(this.searchText || this.historyState?.search_string, false, true);
    this.searchByEnter(this.searchText || this.historyState?.search_string, false, true);
  }

  filterToggle(toggleBy: string){
    if(toggleBy === 'filter' && this.filterToggleTxt === 'filter'){
      this.filterToggleTxt = '';
    } else if(toggleBy === 'sort' && this.filterToggleTxt === 'sort'){
      this.filterToggleTxt = '';
    } else {
      this.filterToggleTxt = toggleBy;
    }
  }

  filterList() {
    const w = document.documentElement.clientWidth;
    const breakpoint = 600;

    if (w > breakpoint) {
      return true;
    } else {
      return (this.isShow = !this.isShow);
    }
  }

  searchByDiscount(filter: string, isFirstLoad: boolean): void {
    if (isFirstLoad) {
      this.productList = [];
      this.pageNumber = 1;
    }
    
    const paginate: interfaces.IPaginate = {
      pageIndex: this.pageNumber,
      pageSize: this.pageLimit,
    };

    this.sharedService.searchProductByDiscount(filter, this.sort, paginate).subscribe(
      (response) => {
        if (response) {
          if (response.DATA.docs.length < 1) {
            this.isDataLoaded = true;
            this.noData = true;
          }
          
          for (let i = 0; i < response.DATA.docs.length; i++) {
            if(response.DATA.docs[i].mainProductId){
              this.sharedService.getProductById(response.DATA.docs[i].mainProductId).subscribe((e: any) => {
                if (e.images)
                  response.DATA.docs[i].images = e.images;
              })
              }
            this.productList.push(response.DATA.docs[i]);
          }
          
          this.pageNumber++;

        } else {
          this.isDataLoaded = true;
        }
      },
      (error) => {}
    );
  }

  ProductCategoryFilter( uuid: string, subUuid: string, className: string, abbreviation: string , category_uuid: string) {
    let searchData: SearchModel;

    searchData = {
      className,
      abbreviation,
      uuid,
      sub_uuid: subUuid,
      category_uuid: category_uuid
    };

    this.sharedService.ProductCategoryFilter(searchData).subscribe(
      (response) => {
        this.categoryFilter = response.DATA.docs;

        this.categoryFilter = this.categoryFilter.filter(e => e.attributeValues && e.attributeValues.length > 0);
        this.knobValues.lower = this.searchDataForFilter ? this.searchDataForFilter.min as number : 0;
        this.knobValues.upper = this.searchDataForFilter ? this.searchDataForFilter.max as number : 1000;

        this.attributeValue = this.categoryFilter[0].attributeValues;
        this.isClicked[0] = true;
      },
      (error) => {}
    );
  }

  allChecked(all: boolean) {
    this.allCheck = all;
    if (this.allCheck === true) {
      // this.employmenttypeId = [];
    }
  }

  selectedAttribute(event: MatCheckboxChange, attribute: interfaces.IAttributeValues) {
    if (event.checked == true) {
      this.selectedFilter.push(attribute.attributeValue);
    } else {
      const index = this.selectedFilter.findIndex((p) => {
        return p === attribute.attributeValue;
      });

      this.selectedFilter.splice(index, 1);
    }
    this.applyFilter();
  }

  isChecked(attribute: interfaces.IAttributeValues): boolean {
    return this.selectedFilter.some((val) => val === attribute.attributeValue);
  }

  filterPrice(){
    if(this.min < this.max){
      this.knobValues.lower = this.min;
      this.knobValues.upper = this.max;
      this.priceRange = true;
      this.applyFilter();
    }
  }

  applyFilter() {
    if (this.selectedFilter.length !== 0 || this.priceRange) {
      this.isFilter = true;
      const searchData = {
        min: this.knobValues.lower,
        max: this.knobValues.upper,
        attribute_value: this.selectedFilter,
        uuid: this.searchDataForFilter?.uuid,
        sub_uuid: this.searchDataForFilter?.sub_uuid,
        category_uuid: this.categoryUUID,
        sort: this.sort_by | 1,
      };

      this.search(searchData, true);
    } else {
      const data = {
        product: [],
        filter: this.selectedFilter,
        dismissed: false,
        min: this.knobValues.lower,
        max: this.knobValues.upper,
      };
      this.isFilter = false;
      this.searchProductByCategory(this.params.uuid, true);
    }
  }

  showAttributeValues(attribute: interfaces.IAttribute, i: number): void {
    // this.isRange = false
    this.isClicked = [false];
    this.attributeValue = attribute.attributeValues;
    this.isClicked[i] = true;
    //    this.attribute
  }

  searchFilterByEnter(searchString: string, isFilter: boolean, isFirstLoad: boolean): void {

    if(isFirstLoad) {
      this.categoryFilter = [];
      this.pageNumber = 1;
    }

    const paginate: interfaces.IPaginate = {
      pageIndex: this.pageNumber,
      pageSize: this.pageLimit,
    };

    this.spinner.show();

    this.sharedService.getSearchProducts(searchString, true, paginate).subscribe((response) => {
      this.categoryFilter = response.DATA as unknown as interfaces.IAttribute[];

      this.categoryFilter = this.categoryFilter.filter(e => e.attributeValues && e.attributeValues.length > 0);
      this.knobValues.lower = this.searchDataForFilter ? this.searchDataForFilter.min as number : 0;
      this.knobValues.upper = this.searchDataForFilter ? this.searchDataForFilter.max as number : 1000;
      this.attributeValue = this.categoryFilter[0].attributeValues;
      this.isClicked[0] = true      
      this.pageNumber++;
      this.spinner.hide();
    }, (error) => {
      this.spinner.hide();
    });
  }

  toggleType() {
    this.typeFilter = !this.typeFilter;
  }


  viewDetail(event: Event, productId: string) {
    event.stopPropagation();
    event.preventDefault();

    let navigationExtras: NavigationExtras = {
      queryParams: {
        product: JSON.stringify(productId),
        filter: JSON.stringify('productById?uuid='+productId),
        type: JSON.stringify('Product')
      }
    }
    
    this.router.navigate([`/product-detail/${Math.random()}`], navigationExtras);
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
    if (type === "Product") {
      const d1 = action + "?uuid=" + uuid;
      // localStorage.setItem('back-route', '/tab/dashboard');
      this.router
        .navigateByUrl("/product-detail/" + Math.random(), {
          state: { filter: d1, type, uuid },
        })
        .catch();
    } else if (type === "Category") {
      this.router
        .navigateByUrl("/product-list/" + uuid, {
          state: {data: { filter: action, uuid, type }},
        })
        .catch();
    } else if (type === "School") {
      this.createModal(uuid, type, action, name).catch();
    } else if (type === "University") {
      this.createModal(uuid, type, action, name).catch();
    } else if (type === "Board") {
      this.createModal(uuid, type, action, name).catch();
    }
  }
  async createModal(
    uuid: string,
    types: string,
    actions: string,
    names: string
  ): Promise<void> {
    // localStorage.setItem('child-category', '/dashboard');
    this.router
      .navigateByUrl("/child-category/" + Math.random(), {
        state: {
          categoryData: uuid,
          type: types,
          action: actions,
          name: names,
        },
      })
      .catch();
  }

  searchByCategory(uuid: string): void {
    let searchData: any;
    searchData = {
      uuid,
    };
    this.sharedService.searchByCategory(searchData).subscribe((response) => {
      this.categoryFilter = (response.DATA.docs).filter(e => e.attributeValues && e.attributeValues.length > 0);

      this.knobValues.lower = this.searchDataForFilter ? this.searchDataForFilter.min as number : 0;
      this.knobValues.upper = this.searchDataForFilter ? this.searchDataForFilter.max as number : 1000;
      this.price = true;
      this.attributeValue = this.categoryFilter[0].attributeValues;
    });
  }

  searchByEnter(
    searchString: string,
    isFilter: boolean,
    isFirstLoad: boolean
  ): void {
    if(isFirstLoad) {
      this.productList = [];
      this.pageNumber = 1;
    }
    const paginate: interfaces.IPaginate = {
      pageIndex: this.pageNumber,
      pageSize: this.pageLimit,
    };
    
    this.spinner.show();
    this.sharedService.getSearchProducts(searchString, false, paginate).subscribe((response) => {
      for (let i = 0; i < response.DATA.docs.length; i++) {
        if(response.DATA.docs[i].mainProductId){
          this.sharedService.getProductById(response.DATA.docs[i].mainProductId).subscribe((e: any) => {
            if (e.images)
              response.DATA.docs[i].images = e.images;
          })
          }
          this.productList.push(response.DATA.docs[i]);
      }
      this.pageNumber++;
      this.spinner.hide();
    }, (error) => {
      this.spinner.hide();
    });
  }

  searchProductByCategory(
    uuid: string,
    isFirstLoad: boolean
  ): void {

    if(isFirstLoad === true) {
      this.productList = [];
      this.pageNumber = 1;
    }
    
    const paginate: interfaces.IPaginate = {
      pageIndex: this.pageNumber,
      pageSize: this.pageLimit,
    };

    this.spinner.show();

    this.sharedService.searchProductByCategory(uuid, this.sort_by, paginate).subscribe((response) => {
      if (response) {
        if (response.DATA.docs.length < 1) {
          this.isDataLoaded = true;
          this.noData = true;
        }
        
        for (let i = 0; i < response.DATA.docs.length; i++) {
          if(response.DATA.docs[i].mainProductId){
            this.sharedService.getProductById(response.DATA.docs[i].mainProductId).subscribe((e: any) => {
              if (e.images)
                response.DATA.docs[i].images = e.images;
            })
            }
          this.productList.push(response.DATA.docs[i] as IProduct);
        }
        
        this.pageNumber++;
        this.spinner.hide();
      }
    }, (error) => {
      this.spinner.hide();
    });
  }
  
  
  calculateOfferPercentage(mrp: number, sellingPrice: number): string | number {
    return sellingPrice > mrp
      ? 0
      : (((mrp - sellingPrice) / mrp) * 100).toFixed();
  }

  releventOfSchool(searchData: SearchModel, isFirstLoad: boolean): void {
    if(isFirstLoad) {
      this.relaventData = [];
      this.pageNumber = 1;
    }

    const paginate: interfaces.IPaginate = {
      pageIndex: this.pageNumberRelavent,
      pageSize: this.pageLimitRelavent,
    };

    this.spinner.show();

    this.sharedService.releventOfSchool(searchData, paginate).subscribe(
      (response) => {
        if (
          response.DATA.boardStandardData.docs.length < 1 &&
          response.DATA.standardData.docs.length < 1
        ) {
          this.noRelavantData = true;
        }
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < response.DATA.standardData.docs?.length; i++) {
          this.relaventData.push(response.DATA.standardData.docs[i] as IProduct);
        }
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < response.DATA.boardStandardData.docs.length; i++) {
          this.relaventData.push(response.DATA.boardStandardData.docs[i] as IProduct);
        }
        
        this.pageNumberRelavent++;
        this.spinner.hide();
      },
      (error) => {
        this.noRelavantData = true;
        this.spinner.hide();
      }
    );
  }

  releventOfBoard(searchData: SearchModel, isFirstLoad: boolean): void {
    if(isFirstLoad) {
      this.pageNumberRelavent = 1;
      this.relaventData = [];
    }

    const paginate: interfaces.IPaginate = {
      pageIndex: this.pageNumberRelavent,
      pageSize: this.pageLimitRelavent,
    };

    this.spinner.show();

    this.sharedService.releventOfBoard(searchData, paginate).subscribe(
      (response) => {
        if (response.DATA.standardData.docs?.length < 1) {
          this.noRelavantData = true;
          return;
        }
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < response.DATA.standardData.docs?.length; i++) {
          this.relaventData.push(response.DATA.standardData.docs[i] as IProduct);
        }
        
        this.pageNumberRelavent++;
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  releventOfUniversity(searchData: SearchModel, isFirstLoad: boolean): void {
    if(isFirstLoad) {
      this.pageNumberRelavent = 1;
      this.relaventData = [];
    }

    const paginate: interfaces.IPaginate = {
      pageIndex: this.pageNumberRelavent,
      pageSize: this.pageLimitRelavent,
    };

    this.spinner.show();
    this.sharedService.releventOfUniversity(searchData, paginate).subscribe((response) => {
      if (response.DATA.docs?.length < 1) {
        this.noRelavantData = true;
        return;
      }
      
      for (let i = 0; i < response.DATA.docs?.length; i++) {
        this.relaventData.push(response.DATA.docs[i] as IProduct);
      }
      if (response.DATA.docs?.length > 0) {
        this.pageNumberRelavent++;
      }
      this.spinner.hide();
    }, (error) => {
      this.spinner.hide();
    });
  }

  releventOfExam(searchData: SearchModel, isFirstLoad: boolean): void {
    if(isFirstLoad == true) {
      this.pageLimitRelavent = 1;
      this.relaventData = [];
    }

    const paginate: interfaces.IPaginate = {
      pageIndex: this.pageNumberRelavent,
      pageSize: this.pageLimitRelavent,
    };

    this.spinner.show();
    this.sharedService.releventOfExam(searchData, paginate).subscribe((response) => {
      if (response.DATA.docs?.length < 1) {
        this.noRelavantData = true;
      }
      
      for (let i = 0; i < response.DATA.docs?.length; i++) {
        this.relaventData.push(response.DATA.docs[i] as IProduct);
      }
      
      if (response.DATA.docs?.length > 0) {
        this.pageNumberRelavent++;
      }
      this.spinner.hide();

    }, (error) => {
      this.spinner.hide();
    });
  }

  relavent(
    searchData: SearchModel,
    isFirstLoad: boolean
  ): void {
    if (this.type.toLowerCase() === "school") {
      this.releventOfSchool(searchData, isFirstLoad);
    } else if (this.type.toLowerCase() === "board") {
      this.releventOfBoard(searchData, isFirstLoad);
    } else if (this.type.toLowerCase() === "university") {
      this.releventOfUniversity(searchData, isFirstLoad);
    } else if (this.type.toLowerCase() === "competition") {
      this.releventOfExam(searchData, isFirstLoad);
    }
  }

  // getSection(identifier: string): Observable<interfaces.ICollection> {
  //   return this.dashboardService.getCollectionById(identifier);
  // }
  getSection(type: string) {
    this.spinner.show();

    const searchData = {
      abbreviation: this.abbreviation,
      className: this.className,
      uuid: this.schoolUUID,
      sub_uuid: this.standardUUID,
      isDigital: this.isDigital,
      min: this.min,
      max: this.max,
      category_uuid: this.categoryUUID,
    };

    this.dashboardService.getSectionofCollection(type).subscribe(
      sectionDATA => {
        if (sectionDATA) {
          this.sections = sectionDATA.DATA.collectionData;
          this.sections = this.sections.sort((a, b) => Number(a.sequence) > Number(b.sequence) ? 1 : -1);
        }
        this.search(searchData, true);
        this.spinner.hide();
      },
      error => {
        this.search(searchData, true);
        this.spinner.hide();
      }
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toString().toLowerCase();

    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }


  search(searchData: SearchModel, isFirstLoad: boolean): void {
    // searchData.sort = this.sort;
    
    if(isFirstLoad == true) {
      this.productList = [];
      this.pageNumber = 1;
      this.noData = false;
    }

    const paginate: interfaces.IPaginate = {
      pageIndex: this.pageNumber,
      pageSize: this.pageLimit,
    };
    
    this.spinner.show();
    this.sharedService.search(searchData, paginate).subscribe(response => {      
      this.spinner.hide();
      if (response.DATA) {
        if (response.DATA.docs.length < 1) {
          return;
        }

        if(!this.noData) {
          for (let i = 0; i < response.DATA?.docs.length; i++) {
            if(response.DATA.docs[i].mainProductId){
              this.sharedService.getProductById(response.DATA.docs[i].mainProductId).subscribe((e: any) => {
                if (e.images)
                  response.DATA.docs[i].images = e.images;
              })
              }
            this.productList.push(response.DATA.docs[i] as IProduct);
          }
        }
        
      }

      if (this.sections?.length > 0) {
        const sectionsToLoad = 3;

        for (let index = 0; index < this.sections.length; index = index + sectionsToLoad - 1) {
          this.collectionDATA.push( this.sections.slice(index, index + sectionsToLoad - 1));
        }

        if (this.pageNumber + 1 < this.sections.length) {
          const observables: Observable<any>[] = [];

          this.collectionDATA[this.pageNumber].forEach(a => {
            observables.push(this.getCollectionById(a.uuid));
          });
          
          this.isSection = true;
          
          forkJoin(...observables).subscribe(res => {
            res.forEach(cc => {
              const collect = this.collectionDATA ? this.collectionDATA[this.pageNumber - 1]?.filter(val => val.uuid === cc.DATA.uuid as any) : [];

              this.dynamicSection.push({
                data: cc.DATA,
                viewType: collect?.length ? collect[0].viewType : '',
              });
            });
          });
        }
      }

      if(response.DATA.docs.length == 20) {
        this.pageNumber++;
      } else if(response.DATA.docs.length < 20) {
        this.noData = true;
      }
    },
    error => {
      this.spinner.hide();
    });
    this.relavent(searchData, isFirstLoad);
  }

  getCollectionById(id: string): Observable<interfaces.ICollection> {
    return this.dashboardService.getCollectionById(id);
  }

  getSortedData(sortyBy: number, isFirstLoad: boolean) {
    if((this.dashboardSearchType === "category" || this.type === "Category") && this.selectedFilter.length == 0 ) {
      this.searchProductByCategory(this.categoryUUID, isFirstLoad);
    } else if (this.selectedFilter.length) {
      const searchData: SearchModel = {
        min: this.min,
        max: this.max,
        uuid: this.categoryUUID ? undefined : this.schoolUUID,
        sub_uuid: this.categoryUUID ? undefined : this.standardUUID,
        attribute_value: this.selectedFilter,
        category_uuid: this.categoryUUID,
        sort: sortyBy,
        isDigital: this.isDigital,
      };
      this.search(searchData, isFirstLoad);
    } else {
      const searchData = {
        min: this.min,
        max: this.max,
        uuid: this.categoryUUID ? undefined : this.schoolUUID,
        sub_uuid: this.categoryUUID ? undefined : this.standardUUID,
        category_uuid: this.categoryUUID,
        sort: sortyBy,
        isDigital: this.isDigital,
      };
      this.search(searchData, isFirstLoad);
    }
  }

  getWishList(): void {
    this.wishlistService.getWishList().subscribe(res => {
      if (res.DATA) {
        this.wishListData = res.DATA;

        this.wishlistProductIds = this.wishListData.products.map(
          e => e.productUUID
        );
      } else {
        this.wishlistProductIds = [];
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

  addWishList(event: Event, uuid: string, actions: string): void {
    event.stopPropagation();
    event.preventDefault();
    this.spinner.show();
    const products = [];

    products.push({ productUUID: uuid });
    
    const wishlistParams = {
      products,
    };
    
    if (this.authService.currentGuestUserValue) {
      this.spinner.hide();
      this.wishList.push({ uuid: uuid, action: actions });
      this.router.navigateByUrl('/side/wishlist').catch();
      return;
    }

    this.wishlistService.addWishList(wishlistParams).subscribe(res => {
      if (res) {
        if (actions === 'add') {
          this.toaster.success('Product is added to wishlist');
        } else if (actions === 'remove') {
          this.toaster.success('Product is removed from wishlist');
        }
        this.getWishList();
        this.spinner.hide();
      }
    });
  }

  SortBy(event: MatRadioChange) {
    this.sort_by = event.value;
    this.getSortedData(this.sort_by, true);
  }

  clearAll() {
    this.selectedFilter = [];
    this.isFilter = false;
    this.min = 0;
    this.max = 10000;
    this.ngOnInit();
  }

  onScrollDown() {
    if(this.sort_by) {
      this.getSortedData(this.sort_by, false);
    } else if (this.dashboardSearchType === "category" || this.type === "Category") {
      if(this.isFilter = true) {
        const searchData = {
          min: this.knobValues.lower,
          max: this.knobValues.upper,
          attribute_value: this.selectedFilter,
          uuid: this.searchDataForFilter?.uuid,
          sub_uuid: this.searchDataForFilter?.sub_uuid,
          category_uuid: this.categoryUUID,
          sort: 1,
        };

        this.search(searchData, false);
      } else {
        this.searchProductByCategory(this.params.uuid, false);
      }
    } else if (this.dashboardSearchType === "custom" || this.type === "Custom") {
      this.searchByDiscount((this.params as any).filter, false);
    } else if (this.searchText || this.historyState?.search_string) {
      // this.searchFilterByEnter(this.searchText || this.historyState?.search_string, false, false);
      this.searchByEnter(this.searchText || this.historyState?.search_string, false, false);
    } else {
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
      this.search(searchData, false); 
    }
  }

  selectPrice(event: MatSliderChange){
    console.log(event);
  }

  
}
