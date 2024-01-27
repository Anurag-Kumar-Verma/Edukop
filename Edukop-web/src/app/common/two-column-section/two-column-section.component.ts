import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { environment } from "src/environments/environment";
import * as interfaces from "@spundan-clients/bookz-interfaces";
import { NavigationExtras, Router } from "@angular/router";

@Component({
  selector: "app-two-column-section",
  templateUrl: "./two-column-section.component.html",
  styleUrls: ["./two-column-section.component.scss"],
})
export class TwoColumnSectionComponent implements OnInit {
  @Input() section!: any;
  @Output() openSectionProductEmit: EventEmitter<{
    action: string;
    typo: string;
    uuid: string;
    name: string;
    isRouterLink?: boolean;
    routerLink?: string;
    orgType?: string;
  }> = new EventEmitter();

  imageApi: string = "";
  thumbApi: string = "";

  constructor(public router: Router) {}

  ngOnInit(): void {
    this.imageApi = environment.imageApi;
    this.thumbApi = environment.thumbApi;
  }

  openSectionProduct(
    action: string,
    typo: string,
    uuid: string,
    name: any,
    isRouterLink?: boolean,
    routerLink?: string,
    orgType?: string
  ): void {
    this.openSectionProductEmit.emit({
      action,
      typo,
      uuid,
      name,
      isRouterLink,
      routerLink,
      orgType,
    });
  }

  test(type: any, action: string, routerLink?: string): void {
    const actionData: any = JSON.parse(action);

    if (type.toLocaleLowerCase() === "category") {
      this.router
        .navigateByUrl("/product-list/" + Math.random(), {
          state: {
            filter: actionData.url,
            uuid: actionData.uuid,
            type,
          },
        })
        .catch();
    } else if (type.toLocaleLowerCase() === "school") {
      this.createModal(
        routerLink as string,
        type.toLocaleLowerCase(),
        actionData.url
      );
    } else if (type.toLocaleLowerCase() === "university") {
      this.createModal(
        routerLink as string,
        type.toLocaleLowerCase(),
        actionData.url
      );
    } else if (type.toLocaleLowerCase() === "board") {
      this.createModal(
        routerLink as string,
        type.toLocaleLowerCase(),
        actionData.url
      );
    }
  }

  createModal(routerLink: string, types: string, modalAction?: string): void {

    let navigationExtras: NavigationExtras = {
      queryParams: {
        filter: JSON.stringify(modalAction),
        type: JSON.stringify(types),
        uuid: JSON.stringify("category?.uuid")
      }
    }

    this.router.navigate([`/side/sub-categories`], navigationExtras);
  }
}
