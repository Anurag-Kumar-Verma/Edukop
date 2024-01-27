import { Component, Input, OnChanges } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
  selector: "app-form-input-validation",
  templateUrl: "./form-input-validation.component.html",
  styleUrls: ["./form-input-validation.component.scss"],
})

export class FormInputValidationComponent {
  @Input() form!: FormGroup;
  @Input() formInput!: string;
  @Input() errorMsg!: string;
  param!: { value: string };

  ngOnChanges() {
    this.param = { value: this.errorMsg };
  }

  get formInputError() {
    if (this.form.controls[this.formInput]) {
      if (
        this.form.controls[this.formInput].touched ||
        this.form.controls[this.formInput].dirty
      ) {
        const errors = this.form.controls[this.formInput].errors;
        for (const errorName in errors) {
          if (errors[errorName]) {
            switch (errorName) {
              case "required":
                return "REQUIRED";
              case "minlength":
                return "MIN_LENGTH";
              case "email":
                return "EMAIL";
              case "invalidPassword":
                return "INVALID_PASSWORD";
              case "validatePhoneNumber":
                return "INVALID_PHONE_NUMBER";
              case "passwordMismatch":
                return "PASSWORD_MISMATCH";
              default:
                return this.form.controls[this.formInput].errors?.[errorName];
            }
          }
        }
        return null;
      }
    }
  }

  getErrorString(formInputError: any): string {
    return "Error." + formInputError;
  }
}
