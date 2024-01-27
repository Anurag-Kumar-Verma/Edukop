import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import * as interfaces from "@spundan-clients/bookz-interfaces";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-scrollable-square-section",
  templateUrl: "./scrollable-square-section.component.html",
  styleUrls: ["./scrollable-square-section.component.scss"],
})
export class ScrollableSquareSectionComponent implements OnInit {
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
