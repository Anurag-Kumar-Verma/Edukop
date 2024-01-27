import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { SharedService } from "../shared/services/shared.service";
import * as interfaces from "@spundan-clients/bookz-interfaces";
import { environment } from "src/environments/environment";
import { ISchool } from "../model/ISchool.model";
import { CategoryStateService } from "../shared/states/category.state";
import { CategoriesService } from "../services/categories.service";
import { IDynamicForm } from "../model/IDynamicForm.model";
import { BoardService } from "../services/boardService.service";
import { DynamicFormService } from "src/app/services/dynamicFormService.service";
import { ToastrService } from "ngx-toastr";

export interface SubCategory {
  type: string;
  categoryData: any;
}

export interface Enroll {
  type: string,
  schoolData: any,
}

@Component({
  selector: "app-sub-category",
  templateUrl: "./sub-category.component.html",
  styleUrls: ["./sub-category.component.scss"],
})
export class SubCategoryComponent implements OnInit {
getInventory(arg0: ISchool) {
throw new Error('Method not implemented.');
}
  filterBy: string = "";
  categoryId: string = "";
  categoryType: string = "";
  imageApi = environment.thumbApi;
  pageNumber: number = 1;
  pageLimit: number = 20;
  searchTrue: boolean = false;
  subData!: SubCategory;
  categoryData: (
    | interfaces.IBoard
    | interfaces.ISchool
    | interfaces.IUniversity
    | interfaces.ICompetition
  )[] = [];
  schoolData: ISchool[] = [];
  categoryTree: interfaces.ICategoryTreeResponse[] = [];
  categoryHistory: interfaces.ICategoryTreeResponse[] = [];
  enrollments: IDynamicForm[] = [];
  catFound!: interfaces.ICategoryTreeResponse;
  enrollmentData!: Enroll;
  activeChild: number = -1;

  throttle = 10;
  scrollDistance = 1;
  scrollUpDistance = 3;

  isDownload: boolean = false;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    public sharedService: SharedService,
    public categoryService: CategoriesService,
    public categoryStateService: CategoryStateService,
    public boardService: BoardService,
    public dynamicService: DynamicFormService,
    public toaster: ToastrService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params) {
        this.filterBy = JSON.parse(params?.["filter"]);
        this.categoryType = JSON.parse(params?.["type"]);
        this.categoryId = JSON.parse(params?.["uuid"]);
      }      
    });

    // this.getCategories();

    if ((this.categoryType !== "novel" || !this.categoryId) && this.categoryType !== "Admission Form") {
      this.searchTrue = false;
      this.getCategoryData(this.filterBy, true);

    } else if (this.categoryType === "Admission Form") {
      this.enrollmentData = {
        type: this.categoryType,
        schoolData: this.schoolData,
      };
      this.getEnrollments(false);
    } else if (this.categoryType === "novel" || this.categoryId) {
      this.getCategoryState();
    }
  }

  //   export interface ICategoryTreeResponse {
  //     id: string;
  //     name: string;
  //     childs: ICategoryTreeResponse[];
  //     show?: boolean;
  // }



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

  getCategoryState(): void {
    this.categoryStateService.getCategoryState().subscribe((val) => {
      if (val !== undefined && val !== null) {
        this.categoryTree = val;
        this.getDynamicCategory(this.categoryTree);
      }
    });
  }

  getDynamicCategory(currentTree: interfaces.ICategoryTreeResponse[]): void {
    if (this.catFound) {
      return;
    }

    if (currentTree != null && currentTree?.length > 0) {
      const index = currentTree.findIndex((a) => a.id === this.categoryId);

      if (index >= 0) {
        this.catFound = currentTree[index];
        this.categoryHistory.push(this.catFound);
      } else {
        for (let indexes = 0; indexes < currentTree.length; indexes++) {
          this.getDynamicCategory(currentTree[indexes].childs);
        }
      }
    }
  }

  getCategoryData(filter: string, isFirstLoad: boolean): void {
    let str = filter;
    const lastIndex = str?.lastIndexOf("/");
    str = str.substring(0, lastIndex);
    if (isFirstLoad === true) {
      this.categoryData = [];
      this.pageNumber = 1;
    }

    filter = str + `?size=${this.pageLimit}&page=${this.pageNumber}`;
    this.searchTrue = false;

    this.spinner.show();

    this.sharedService.getCategoryData(filter).subscribe(
      (res) => {
        let response = res as interfaces.IResponsePaginationGet<
          | interfaces.IBoard[]
          | interfaces.ISchool[]
          | interfaces.ICompetition[]
          | interfaces.IUniversity[]
        >;

        response.DATA.docs = response.DATA.docs as
          | interfaces.IBoard[]
          | interfaces.ISchool[]
          | interfaces.ICompetition[]
          | interfaces.IUniversity[];
        if (response.DATA.docs.length < 1) {
        } else {
          for (let i = 0; i < response.DATA.docs.length; i++) {
            this.categoryData.push(response.DATA.docs[i]);
          }

          this.pageNumber++;

          this.subData = {
            type: this.categoryType.toLowerCase(),
            categoryData: this.categoryData as
              | interfaces.IBoard[]
              | interfaces.ISchool[]
              | interfaces.IUniversity[]
              | interfaces.ICompetition[],
          };
        }

        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  downloadAction(event: Event, data: any): void {
    event.preventDefault();
    console.log(data);

    if (data.childs) {
      const uuid = data.id;
      const type = "Category";

      this.router
        .navigateByUrl("product-list/" + Math.random(), {
          state: { filter: undefined, uuid, type },
        })
        .catch();
    } else {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          type: JSON.stringify(this.categoryType),
          name: JSON.stringify(data.name),
          modalAction: JSON.stringify(''),
          abbreviation: JSON.stringify(data.abbreviation || null)
        },
      };

      this.router.navigate([`/side/download-by-category/${data.uuid}`], navigationExtras).catch();
    }
  }

  openSubChild(index: number) {
    if (index != this.activeChild) {
      this.activeChild = index;
    } else {
      this.activeChild = -1;
    }
  }

  viewChild(itemId: string, itemName: string, itemAbbr: string) {
    console.log(itemId, itemName, itemAbbr);
    if (this.categoryType != "School Uniform" && this.categoryType != "College Uniform") {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          type: JSON.stringify(this.categoryType),
          name: JSON.stringify(itemName),
          modalAction: JSON.stringify(''),
          abbreviation: JSON.stringify(itemAbbr || null)
        },
      };
      this.router
        .navigate([`/side/child-categories/${itemId}`], navigationExtras)
        .catch();
      return;
    }
    const data = {
      abbreviation: itemAbbr || null,
      name: itemName,
      uuid: itemId,
      category_uuid: this.categoryId,
      type: this.categoryType,
      // className: category.name,
    };
    localStorage.setItem("listItemsType", this.categoryType);
    this.router.navigateByUrl("/product-list/" + Math.random(), {
      state: { data },
    });

  }

  viewProducts(childId: string) {
    const type = "Category";
    const uuid = childId;

    this.router.navigateByUrl('product-list/' + Math.random(), {
      state: { filter: undefined, uuid, type },
    })
      .catch();
  }

  getEnrollments(isFirstLoad: boolean): void {

    if (isFirstLoad) {
      this.enrollments = [];
      this.pageNumber = 1;
    }
    const filter = `?size=${this.pageLimit}&page=${this.pageNumber}`;

    this.searchTrue = false;

    this.spinner.show();

    this.boardService.getEnrollments(filter).subscribe(response => {
      if (response.DATA.docs.length < 1) {
        return;
      }

      for (let i = 0; i < response.DATA.docs.length; i++) {
        this.enrollments.push(response.DATA.docs[i]);
        // this.schoolData.push(response.DATA.docs[i])
      }
      this.enrollments.filter((a, index) => {
        if (a.orgType.toLowerCase() == 'school') {
          this.schoolData.push(a.schoolDetail);
        }
      })

      // this.getSchoolsByUUIDS();

      this.pageNumber++;
      this.spinner.hide();

    }, (error) => {
      this.spinner.hide()
    });
  }

  getSchoolsByUUIDS() {
    this.spinner.show();

    this.sharedService.getSchoolsByIds(this.enrollments.map(a => a.org_id)).subscribe(res => {
      if (res) {
        for (let i = 0; i < res.DATA.docs.length; i++) {
          this.schoolData.push(res.DATA.docs[i] as ISchool);
        }

        this.spinner.hide();
      }
    }, (error) => {
      this.spinner.hide();
    });
  }

  OpenForm(uuid: string): void {
    // this.router.navigate([`/side/enrollment-form/${uuid}`]);

    let navigationExtras: NavigationExtras = {
      queryParams: {
        product: JSON.stringify(uuid),
        filter: JSON.stringify('productById?uuid=' + uuid),
        type: JSON.stringify('Product')
      }
    }

    this.router.navigate([`/product-detail/${Math.random()}`], navigationExtras);
  }


  formList(): void {
    this.router.navigate(['/side/form-list/']);
  }

  back() {
    history.back();
  }

  downloadToggle() {
    this.isDownload = !this.isDownload;
  }

  onScrollDown() {
    if ((this.categoryType !== "novel" || !this.categoryId) && this.categoryType !== "Admission Form") {
      this.searchTrue = false;
      this.getCategoryData(this.filterBy, false);
    }
  }
}
