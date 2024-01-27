import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LoaderService } from '../shared/loader/loader.service';
import { RouteService } from '../shared/services/router.service';
import { ToastService } from '../shared/services/toast.service';
import { changePasswordService } from './service/changePassword.service';

@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.page.html",
  styleUrls: ["./change-password.page.scss"],
})
export class ChangePasswordPage implements OnInit {
  changePassForm!: FormGroup;

  constructor(
    public routeService: RouteService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private loading: LoaderService,
    public toastr: ToastService,
    private changePasswordServ: changePasswordService
  ) {}

  ngOnInit() {
    this.formSetup();
  }

  formSetup() {
    this.changePassForm = this.fb.group({
      oldPassword: ["", Validators.required],
      password: [
        "",
        Validators.compose([Validators.required, Validators.minLength(6)]),
      ],
    });
  }

  checkSamePass(): boolean {
    return this.changePassForm.controls.oldPassword.value === this.changePassForm.controls.password.value;
  }

  submit(){
    if(this.changePassForm.invalid) {
      return;
    } else {
      this.loading.display(true);
      this.changePasswordServ
        .changePassword(this.changePassForm.value)
        .subscribe(
          (res) => {
            if (res.STATUS === "SUCCESS") {
              this.toastr.showToast(res.MESSAGE, "start");
              this.changePassForm.reset();
              this.loading.display(false);
              history.back();
            } else {
              this.toastr.showToast(res || res.MESSAGE, "start");
              this.loading.display(false);
            }
          },
          (error) => {
            this.toastr.showToast(error.error, "start");
            this.loading.display(false);
          }
        );
    }
  }

  goback(): void {
    this.routeService.navigateToBack("ionic");
  }
}
