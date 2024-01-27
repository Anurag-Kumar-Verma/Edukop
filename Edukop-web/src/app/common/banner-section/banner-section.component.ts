import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import * as interfaces from "@spundan-clients/bookz-interfaces";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-banner-section",
  templateUrl: "./banner-section.component.html",
  styleUrls: ["./banner-section.component.scss"],
})
export class BannerSectionComponent implements OnInit {
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

  constructor() {}

  ngOnInit(): void {
    this.imageApi = environment.imageApi;
    this.thumbApi = environment.thumbApi;
  }

  openSectionProduct(
    action: string,
    typo: string,
    uuid: string,
    name: string,
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
}
