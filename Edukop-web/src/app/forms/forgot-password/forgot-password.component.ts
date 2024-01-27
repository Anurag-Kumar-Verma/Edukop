import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxOtpInputConfig } from 'ngx-otp-input';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/auth.service';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.scss"],
})
export class ForgotPasswordComponent implements OnInit {
  forgotPassForm!: FormGroup;
  otpForm!: FormGroup;
  showOTPInput: boolean = false;
  OTPmessage!: string;
  isPhone: boolean = false;
  showPassword: boolean = false;
  showPassword2: boolean = false;
  isSetPassword: boolean = false;
  otpResponse: any;
  OTP: string = "";

  otpInputConfig: NgxOtpInputConfig = {
    otpLength: 6,
    numericInputMode: true,
    autofocus: true,
  };

  constructor(
    private fb: FormBuilder,
    public spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private sharedServ: SharedService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loginFormGroup();
    this.otpFormSetup();
    this.manageForm();
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

  emailMobbileInput(e: any) {
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

    this.spinner.show();
    this.authService.otpSend(this.isPhone, emailVal).subscribe(
      (res) => {
        if (res) {
          res.STATUS
            ? this.toastr.success(res.MESSAGE)
            : this.toastr.error(res.MESSAGE);
          this.showOTPInput = true;
          this.otpResponse = res.DATA;
          this.spinner.hide();
        }
      },
      (error) => {
        console.log(error);
        this.toastr.error(error.error);
        this.spinner.hide();
      }
    );
    this.forgotPassForm;
  }

  ValidateOTP(): void {
    this.spinner.show();
    const OTP = this.otpForm.controls["otp"].value;

    this.authService.otpValidate(this.otpResponse.uuid, OTP).subscribe(
      (res) => {
        if (res) {
          this.toastr.success("OTP Verified successfully");

          this.isSetPassword = true;
          this.showOTPInput = false;
          this.manageForm();
        } else {
          this.toastr.error("OTP Validation Failed");
        }
        this.spinner.hide();
      },
      (error) => {
        console.log(error);
        this.spinner.hide();
        this.toastr.error("OTP Validation Failed");
      }
    );
  }

  handleOtpChange(event: string[]) {
    this.OTP = "";
  }
  handleFillEvent(event: string) {
    this.OTP = event;
    if (this.OTP.length === 6) {
      this.ValidateOTP();
    }
  }

  enterOTP(event: any) {
    this.otpForm.patchValue({
      otp: event.target.value,
    });
    if (this.otpForm.valid && event.keyCode == 13) {
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
    this.spinner.show();
    this.sharedServ.forgotPassword(this.forgotPassForm.value).subscribe(
      (res) => {
        if (res) {
          this.toastr.success(res.MESSAGE);
          history.back();
          this.spinner.hide();
        }
      },
      (error) => {
        console.log(error);
        this.spinner.hide();
      }
    );
  }
}
