import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { SharedService } from "src/app/shared/services/shared.service";

@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.scss"],
})
export class ChangePasswordComponent implements OnInit {
  changePassForm!: FormGroup;
  showPassword: boolean = false;
  showPassword2: boolean = false;

  constructor(
    private fb: FormBuilder,
    public sharedService: SharedService,
    public toaster: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.addressForm();
  }

  addressForm(): void {
    this.changePassForm = this.fb.group({
      oldPassword: ["", Validators.required],
      password: [
        "",
        Validators.compose([Validators.required, Validators.minLength(6)]),
      ],
    });
  }

  checkSamePass(): boolean {
    return (
      this.changePassForm.controls['oldPassword'].value ===
      this.changePassForm.controls['password'].value
    );
  }

  cancel() {
    this.changePassForm.reset();
    history.back();
  }

  submit() {
    if (!this.changePassForm.invalid) {
      this.spinner.show();
      this.sharedService.changePassword(this.changePassForm.value).subscribe(
        (res) => {
          if (res.STATUS === "SUCCESS") {
            this.toaster.success(res.MESSAGE);
            this.changePassForm.reset();
            this.spinner.hide();
            history.back();
          } else {
            this.toaster.show(res || res.MESSAGE, "start");
            this.spinner.hide();
          }
        },
        (error) => {
          console.log(error);
          this.toaster.error(error.error);
          this.spinner.hide();
        }
      );
    } else {
      return;
    }
  }
}
