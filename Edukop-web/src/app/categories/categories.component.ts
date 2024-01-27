import { Component, OnInit } from "@angular/core";
import { NavigationExtras, Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { CategoriesService } from "../services/categories.service";
import * as interfaces from "@spundan-clients/bookz-interfaces";

@Component({
  selector: "app-categories",
  templateUrl: "./categories.component.html",
  styleUrls: ["./categories.component.scss"],
})
export class CategoriesComponent implements OnInit {
  categoryTree: interfaces.ICategoryTreeResponse[] = [];
  categoryIndex: number = -1;
  childIndex: number = -1;

  constructor(
    public router: Router,
    public toaster: ToastrService,
    private categoryService: CategoriesService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories(): void {
    this.spinner.show();
    this.categoryService.getCategoryTree().subscribe(
      (res) => {
        for (let i in res) {
          this.categoryTree.push(res[i]);
        }
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  showChild(event: Event, index: number) {
    event.preventDefault();
    if (index != this.categoryIndex) {
      this.categoryIndex = index;
    } else {
      this.categoryIndex = -1;
    }
  }

  showSubChild(event: Event, catIndex: number, index: number) {
    event.preventDefault();
    if (index != this.childIndex) {
      this.categoryIndex = catIndex;
      this.childIndex = index;
    } else {
      this.childIndex = -1;
    }
  }

  openCategory(event: Event, categoryId: string, categoryName: string): void {
    event.preventDefault();
    let navigationExtras: NavigationExtras = {
      queryParams: {
        type: JSON.stringify("category")
      }
    }
    
    this.router.navigateByUrl("/product-list/" + Math.random(), {
      state: {data: {
        type: "category",
        uuid: categoryId,
        name: categoryName,
      }}
    })
    .catch();
  }
}
