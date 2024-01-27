import { AfterContentInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../shared/loader/loader.service';
import { ToastService } from '../shared/services/toast.service';
import { RouteService } from "../shared/services/router.service";
import { Router } from '@angular/router';
import { SharedService } from '../shared/services/shared.service';
import { AuthService } from '../auth/services/auth.service';
import { NgOtpInputConfig } from 'ng-otp-input';

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.page.html",
  styleUrls: ["./forgot-password.page.scss"],
})
export class ForgotPasswordPage implements OnInit, AfterContentInit {
  @ViewChild("ngOtpInput", { static: false }) ngOtpInput: any;
  configOpt: NgOtpInputConfig = {
    length: 6,
    allowNumbersOnly: true,
    placeholder: "0",
  };
  forgotPassForm!: FormGroup;
  otpForm!: FormGroup;
  showOTPInput: boolean = false;
  OTPmessage!: string;
  isPhone: boolean = false;
  showPassword: boolean = false;
  showPassword2: boolean = false;
  isSetPassword: boolean = false;
  otpResponse: any;

  constructor(
    private fb: FormBuilder,
    private loading: LoaderService,
    private toastr: ToastService,
    private sharedServ: SharedService,
    private authService: AuthService,
    public routeService: RouteService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.loginFormGroup();
    this.otpFormSetup();
    this.manageForm();
  }

  ngAfterContentInit(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.showOTPInput = false;
    this.isSetPassword = false;
  }

  loginFormGroup(): void {
    this.forgotPassForm = this.fb.group({
      emailOrMobile: ["", Validators.required],
      isMobile: [this.isPhone],
      password: [
        "",
        Validators.compose([Validators.required, Validators.minLength(6)]),
      ],
      confirmPassword: ["", Validators.required],
    });
  }

  manageForm() {
    if (!this.isSetPassword) {
      this.forgotPassForm.removeControl("password");
      this.forgotPassForm.removeControl("confirmPassword");
    } else {
      this.forgotPassForm.addControl(
        "password",
        new FormControl(
          "",
          Validators.compose([Validators.required, Validators.minLength(6)])
        )
      );
      this.forgotPassForm.addControl(
        "confirmPassword",
        new FormControl("", Validators.required)
      );
    }
  }

  otpFormSetup(): void {
    this.otpForm = this.fb.group({
      otp: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(6),
        ]),
      ],
    });
  }

  emailMobileInput(e: any) {
    if (Number(e.target.value)) {
      this.forgotPassForm.controls["emailOrMobile"].setValidators(
        Validators.compose([
          Validators.required,
          Validators.pattern("^[6-9][0-9]{9}$"),
        ])
      );
      this.forgotPassForm.patchValue({
        isMobile: true,
      });
    } else if (!Number(e.target.value)) {
      this.forgotPassForm.controls["emailOrMobile"].setValidators(
        Validators.compose([Validators.required, Validators.email])
      );
      this.forgotPassForm.patchValue({
        isMobile: false,
      });
    } else {
      this.forgotPassForm.controls["emailOrMobile"].setValidators(
        Validators.required
      );
      this.forgotPassForm.patchValue({
        isMobile: false,
      });
    }
  }

  checkIfEmailInString(text: string): boolean {
    const re =
      /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
    return re.test(text);
  }

  checkIfPhoneNoInString(text: string): boolean {
    const phoneExp =
      /(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?/gim;
    return phoneExp.test(text);
  }

  getOtp() {
    let emailVal = this.forgotPassForm.valid
      ? this.forgotPassForm.controls["emailOrMobile"].value
      : "";

    if (this.checkIfEmailInString(emailVal)) {
      this.OTPmessage = "An OTP is sent to your email " + emailVal + ".";
      this.isPhone = false;
    } else if (this.checkIfPhoneNoInString(emailVal)) {
      this.isPhone = true;
      this.OTPmessage = "An OTP is sent to your number +91" + emailVal;
    }

    this.loading.display(true);
    this.authService.otpSend(this.isPhone, emailVal).subscribe(
      (res) => {
        if (res) {
          res.STATUS
            ? this.toastr.showToast(res.MESSAGE, "end")
            : this.toastr.showToast(res.MESSAGE, "start");
          this.showOTPInput = true;
          this.otpResponse = res.DATA;
          this.loading.display(false);
        }
      },
      (error) => {
        console.log(error);
        this.toastr.showToast(error.error, "end");
        this.loading.display(false);
      }
    );
    this.forgotPassForm;
  }

  ValidateOTP(): void {
    this.loading.display(true);
    const OTP = this.otpForm.controls["otp"].value;

    this.authService.otpValidate(this.otpResponse.uuid, OTP).subscribe(
      (res) => {
        if (res) {
          this.toastr.showToast("OTP Verified successfully", "start");

          this.isSetPassword = true;
          this.showOTPInput = false;
          this.manageForm();
        } else {
          this.toastr.showToast("OTP Validation Failed", "end");
        }
        this.loading.display(false);
      },
      (error) => {
        console.log(error);
        this.loading.display(false);
        this.toastr.showToast("OTP Validation Failed", "end");
      }
    );
  }

  enterOTP(event: string) {
    this.otpForm.patchValue({
      otp: event,
    });
    if (this.otpForm.valid) {
      this.ValidateOTP();
    }
  }

  checkSamePass(): boolean {
    return (
      this.forgotPassForm.controls["confirmPassword"].value ===
      this.forgotPassForm.controls["password"].value
    );
  }
  setPassword() {
    this.loading.display(true);
    this.sharedServ.forgotPassword(this.forgotPassForm.value).subscribe(
      (res) => {
        if (res) {
          this.toastr.showToast(res.MESSAGE, "start");
          this.loading.display(false);
          this.router.navigateByUrl("/tab/login");
        }
      },
      (error) => {
        console.log(error);
        this.loading.display(false);
      }
    );
  }

  goback(): void {
    this.router.navigateByUrl("/tab/login");
  }
}
