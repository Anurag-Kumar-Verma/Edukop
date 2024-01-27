import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ClassCategoryService } from "../services/classCategory.service";
import * as interfaces from "@spundan-clients/bookz-interfaces";
import { NgxSpinnerService } from "ngx-spinner";
import { ICompetition, IExam } from "../model/ICompetition.model";
import { ClassCategory } from "../model/classCategory.model";
import { ICollection } from "../model/ICollection.model";
import { DashboardService } from "../services/dashboard.service";
import { environment } from "src/environments/environment";

export interface Child {
  type: string;
  list: any;
}

export interface Exam {
  type: string;
  exam: any;
}

@Component({
  selector: "app-child-category",
  templateUrl: "./child-category.component.html",
  styleUrls: ["./child-category.component.scss"],
})
export class ChildCategoryComponent implements OnInit {
  itemId: string = "";
  itemType: string = "";
  itemName: string = "";
  action: string = "";
  imageApi = environment.thumbApi;
  childDataList: any[] = [];
  standardList: interfaces.IStandard[] = [];
  sectionSchool!: any;
  ChildData!: Child;
  examData!: Exam;
  examList: ICompetition[] = [];
  List: any[] = [];
  abbreviation: string = "";

  pageNumber: number = 0;
  coursePageNo: number = 1;
  pageLimit: number = 30;

  throttle = 300;
  scrollDistance = 2;
  scrollUpDistance = 3;

  noMoreCourse: boolean = true;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    public classService: ClassCategoryService,
    public dashboardService: DashboardService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.itemId = this.route.snapshot.paramMap.get("id") as string;
    this.route.queryParams.subscribe((params) => {
      if (params) {
        this.itemType = JSON.parse(params?.["type"]);
        this.action = JSON.parse(params?.["modalAction"]);
        this.itemName = JSON.parse(params?.["name"]);
        this.abbreviation = JSON.parse(params?.["abbreviation"]);

        if (
          this.itemType.toLowerCase() !== "university" &&
          this.itemType.toLowerCase() !== "competition"
        ) {
          this.getStandards();
          this.getSectionSchool();
        } else if (this.itemType.toLowerCase() === "university") {
          this.getCourses(true);
        } else if (this.itemType.toLowerCase() === "competition") {
          this.getExam(this.itemId);
        } else {
          return;
        }
      }
    });
  }

  getStandards(): void {
    this.spinner.show();
    this.classService.getStandards().subscribe((res) => {
      this.List = res.DATA.docs;
      this.standardList = this.List.sort((a, b) =>
        Number(a.abbreviation) > Number(b.abbreviation) ? 1 : -1
      );

      this.spinner.hide();

      this.ChildData = {
        type: this.itemType,
        list: this.List,
      };
    });
  }

  getCourses(isFirstLoad: boolean): void {
    const paginate: interfaces.IPaginate = {
      pageIndex: this.coursePageNo,
      pageSize: this.pageLimit,
    };

    if (isFirstLoad == true) {
      this.List = [];
      this.coursePageNo = 1;
    }

    this.spinner.hide();

    this.classService.getCourses(paginate).subscribe(
      (res) => {
        if (res.DATA.docs.length < 1) {
          this.noMoreCourse = true;
          return;
        } else if (res.DATA.docs.length == 30) {
          this.noMoreCourse = false;
        }

        for (let i = 0; i < res.DATA.docs.length; i++) {
          this.List.push(res.DATA.docs[i]);
        }

        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
      }
    );
    this.ChildData = {
      type: this.itemType.toLowerCase(),
      list: this.List,
    };
  }

  getExam(id: string): void {
    this.spinner.show();
    this.classService.getExam(id).subscribe(
      (response) => {
        this.examList = response.DATA.docs as any;
        this.examData = {
          type: this.itemType,
          exam: this.examList,
        };
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  getSectionSchool(): void {
    this.spinner.show();
    this.dashboardService.getSectionSchool().subscribe((response) => {
      this.sectionSchool = response.DATA;
      this.spinner.hide();
    });
  }

  productPage(category: ClassCategory): void {
    const data = {
      abbreviation: this.abbreviation,
      name: this.itemName,
      uuid: this.itemId,
      sub_uuid: category.uuid,
      type: this.itemType,
      className: category.name,
    };

    localStorage.setItem("listItemsType", this.itemType);

    this.router.navigateByUrl("/product-list/" + Math.random(), {
      state: { data },
    });
  }

  getStandardList(uuid: string, name: string, abbreviation: string): void {
    this.spinner.show();

    setTimeout(() => {
      this.spinner.hide();
    }, 200);

    this.abbreviation = "";
    this.itemId = uuid;
    this.itemName = name;
    this.abbreviation = abbreviation;
    this.itemType = this.itemType.toLowerCase();

    this.getStandards();
  }

  scrollPage() {
    this.pageNumber++;
    this.coursePageNo++;
    if (this.itemType.toLowerCase() === "university") {
      this.getCourses(false);
    }
  }

  back() {
    history.back();
  }
}
