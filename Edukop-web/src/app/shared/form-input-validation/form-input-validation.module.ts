import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormInputValidationComponent } from "./form-input-validation.component";
export function httpLoaderFactory(http: HttpClient) {
}


@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [FormInputValidationComponent],
  exports: [FormInputValidationComponent],
  providers: [],
})
export class FormInputValidationModule {
  constructor( ) {
  }
}
