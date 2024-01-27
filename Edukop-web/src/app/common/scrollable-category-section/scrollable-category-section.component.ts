import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import * as interfaces from "@spundan-clients/bookz-interfaces";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-scrollable-category-section",
  templateUrl: "./scrollable-category-section.component.html",
  styleUrls: ["./scrollable-category-section.component.scss"],
})
export class ScrollableCategorySectionComponent implements OnInit {
  @Input() section!: interfaces.ICollection;
  @Output() openCategoryEmit: EventEmitter<{ category: any }> =
    new EventEmitter();

  imageApi: string = "";
  thumbApi: string = "";

  constructor(public router: Router) {
    this.imageApi = environment.imageApi;
    this.thumbApi = environment.thumbApi;
  }

  ngOnInit(): void {}

  
  openCategory(category: any): void {
    this.openCategoryEmit.emit({
      category: {
        filter: category.action,
        type: category.orgType,
        routerLink: category.routerLink,
        uuid: category.category_uuid ? category.category_uuid : category._id,
      },
    });
  }

  openAllCategory(): void {
    this.router.navigateByUrl("/side/categories").catch();
  }
}
