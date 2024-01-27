import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import * as interfaces from "@spundan-clients/bookz-interfaces";
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser } from "angularx-social-login";
import { NgxOtpInputConfig } from "ngx-otp-input";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "src/app/auth/auth.service";
import { IUser } from "src/app/model/IUser.model";
import { DashboardService } from "src/app/services/dashboard.service";
import { LoaderService } from "src/app/shared/loader/loader.service";
import { SharedService } from "src/app/shared/services/shared.service";
import { CartStateService } from "src/app/shared/states/cart.state";
import { UserStateService } from "src/app/shared/states/user-info.state";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  otpLoginForm!: FormGroup;
  OTP: string = "";
  showOTPInput: boolean = false;
  OTPmessage!: string;
  isGuest: boolean = false;
  showPassword: boolean = false;
  timeLeft: number = 120;
  timerStart: boolean = false;
  otpResponse: any;
  otpRetry: number = 0;
  isPhone: boolean = false;
  interval: any;
  isOTPLogin: boolean = false;
  email: string = "";
  backRoute!: string;
  userDetails!: IUser;
  otpInputConfig: NgxOtpInputConfig = {
    otpLength: 6,
    numericInputMode: true,
    autofocus: true,
  };

  googleUserInfo!: SocialUser;
  facebookUserInfo!: SocialUser;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userStateService: UserStateService,
    public router: Router,
    public spinner: NgxSpinnerService,
    private toastr: ToastrService,
    public dashboardService: DashboardService,
    private socialAuthService: SocialAuthService,
    public cartStateService: CartStateService,
    private sharedServ: SharedService,
    private loader: LoaderService
  ) {}

  ngOnInit(): void {
    this.isGuest = this.authService.currentGuestUserValue;
    this.loginFormGroup();
    this.otpLoginFormGroup();
  }

  loginFormGroup(): void {
    this.loginForm = this.fb.group({
      email: ["", Validators.compose([Validators.required])],
      password: [
        "",
        Validators.compose([Validators.required, Validators.minLength(6)]),
      ],
    });
  }

  otpLoginFormGroup(): void {
    this.otpLoginForm = this.fb.group({
      email: ["", Validators.required],
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onInputEmailTime(e: any) {
    if (Number(this.loginForm.controls["email"].value)) {
      this.loginForm.controls["email"].setValidators(
        Validators.pattern("^[6-9][0-9]{9}$")
      );
    } else if (!Number(this.loginForm.controls["email"].value)) {
      this.loginForm.controls["email"].setValidators(Validators.email);
    } else {
      this.loginForm.controls["email"].setValidators(Validators.required);
    }
  }

  onInputTime(e: any) {
    if (Number(this.otpLoginForm.controls["email"].value)) {
      this.otpLoginForm.controls["email"].setValidators(
        Validators.pattern("^[6-9][0-9]{9}$")
      );
    } else if (!Number(this.otpLoginForm.controls["email"].value)) {
      this.otpLoginForm.controls["email"].setValidators(Validators.email);
    } else {
      this.otpLoginForm.controls["email"].setValidators(Validators.required);
    }

    if (this.otpLoginForm.valid && e.keyCode == 13) {
      this.logInViaOTP();
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

  logInViaOTP(): void {
    let emailVal = !this.isOTPLogin
      ? this.loginForm.controls["email"].value
      : this.otpLoginForm.controls["email"].value;

    if (this.checkIfEmailInString(emailVal)) {
      this.OTPmessage = "An OTP is sent to your email " + emailVal + ".";
      this.isPhone = false;
    } else if (this.checkIfPhoneNoInString(emailVal)) {
      this.isPhone = true;
      this.OTPmessage = "An OTP is sent to your number +91" + emailVal;
    }

    if (emailVal) {
      this.authService.otpSend(this.isPhone, emailVal).subscribe((res) => {
        if (res) {
          this.timerStart = true;
          this.showOTPInput = true;
          this.timeLeft = 120;
          this.startTimer();
          this.otpResponse = res.DATA;
        }
      });
    } else {
      this.toastr.error("Please enter email or mobile.");
    }
  }

  emailPassword() {
    if (this.loginForm.invalid) {
      return;
    } else {
      this.spinner.show();
      this.authService.emailLogin(this.loginForm.value).subscribe(
        (res) => {
          if (res.payload) {
            this.sharedServ.getUserInfo().subscribe(
              (res) => {
                this.userDetails = res.DATA;
                if (this.userDetails.isVerified) {
                  this.userStateService.setUserState(11 as any);
                  localStorage.removeItem("last-route");
                  this.toastr.success("Login successfully");
                  if (
                    this.backRoute &&
                    (this.backRoute === "/product-list" ||
                      this.backRoute === "/product-detail")
                  ) {
                    history.back();
                  } else {
                    this.router.navigate(["/dashboard"]);
                  }
                } else {
                  this.logInViaOTP();
                }
                this.spinner.hide();
              },
              (error) => {
                this.spinner.hide();
              }
            );
          }
        },
        (error) => {
          console.log(error);
          this.toastr.error(error.error);
          this.spinner.hide();
        }
      );
    }
  }

  otpPassToggle() {
    this.isOTPLogin = !this.isOTPLogin;
  }

  formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;

    if (seconds < 10) {
      seconds = Number(`0${seconds}`);
    }

    return `${minutes}:${seconds}`;
  }

  startTimer(): void {
    this.timeLeft = 120;
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      }
    }, 1000);
  }

  pauseTimer(): void {
    clearInterval(this.interval);
    this.timeLeft = 60;
  }

  resendOTP(): void {
    this.OTP = "";
    this.otpRetry++;
    if (this.otpRetry > 2) {
      this.timeLeft = 0;
    }
    clearTimeout(this.interval);
    this.timerStart = false;
    this.logInViaOTP();
  }

  ValidateOTP(): void {
    const route = localStorage.getItem("last-route");
    this.spinner.show();
    this.authService.otpValidate(this.otpResponse.uuid, this.OTP).subscribe(
      (res) => {
        if (res) {
          this.userStateService.setUserState(11 as any);
          localStorage.removeItem("last-route");
          this.toastr.success("OTP Verified successfully");
          setTimeout(() => {
            this.toastr.success("Login successfully");
          }, 2000);
          if (
            this.backRoute &&
            (this.backRoute === "/product-list" ||
              this.backRoute === "/product-detail")
          ) {
            history.back();
          } else {
            this.router.navigate(["/dashboard"]);
          }
        } else {
          this.toastr.error("OTP Validation Failed");
        }
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
        this.toastr.error("OTP Validation Failed");
      }
    );
  }

  enterOTP(event: any) {
    if (event.keyCode == 13 && this.OTP && this.OTP.length == 6) {
      this.ValidateOTP();
    }
  }

  backLogin() {
    this.pauseTimer();
    this.showOTPInput = false;
    this.timerStart = false;
    this.timeLeft = 0;
  }

  guestLogin(): void {
    this.authService.guestUserLogin();
  }

  getCarts(): void {
    this.dashboardService.getCart().subscribe((res) => {
      if (res.DATA !== undefined && res.DATA !== null && res.DATA.products) {
        this.cartStateService.setCartState(res.DATA.products.length);
      }
    });
  }

  handleOtpChange(event: string[]) {
    this.OTP = "";
  }
  handleFillEvent(event: string) {
    this.OTP = event;
  }

  async googleAuth() {
    const route = localStorage.getItem("last-route");
    this.googleUserInfo = await this.socialAuthService.signIn(
      GoogleLoginProvider.PROVIDER_ID
    );
    const data = {
      token: this.googleUserInfo.idToken,
    };

    this.spinner.show();
    this.authService.googleAuth(this.googleUserInfo.idToken).subscribe(
      async (res) => {
        this.getCarts();
        this.spinner.hide();
        if (route) {
          this.router.navigateByUrl(route);
        } else {
          this.router.navigate(["/dashboard"]);
        }
        this.userStateService.setUserState(11 as any);
      },
      (error) => {
        this.toastr.error(JSON.stringify(error.error));
        this.spinner.hide();
      }
    );
  }

  async facebookAuth() {
    this.spinner.show();

    this.facebookUserInfo = await this.socialAuthService.signIn(
      FacebookLoginProvider.PROVIDER_ID
    );
    if (this.facebookUserInfo) {
      this.authService.facebookAuth(this.facebookUserInfo.authToken).subscribe(
        async (res) => {
          this.getCarts();
          this.router.navigate(["/dashboard"]);
          this.userStateService.setUserState(11 as any);
          this.spinner.hide();
          this.socialAuthService.signOut();
        },
        (error) => {
          this.toastr.error(error.error);
          this.spinner.hide();
        }
      );
    }
  }
}
