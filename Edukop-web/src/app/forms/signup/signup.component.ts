import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NavigationEnd, Router } from "@angular/router";
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser } from "angularx-social-login";
import { CountryISO, PhoneNumberFormat, SearchCountryField } from "ngx-intl-tel-input";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "src/app/auth/auth.service";
import { UserStateService } from "src/app/shared/states/user-info.state";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  showPassword: boolean = false;
  showPassword2: boolean = false;

  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;

  googleUserInfo!: SocialUser;
  facebookUserInfo!: SocialUser;

  constructor(
    private fb: FormBuilder,
    public router: Router,
    private userStateService: UserStateService,
    private socialAuthService: SocialAuthService,
    private authServ: AuthService,
    private toastr: ToastrService,
    public spinner: NgxSpinnerService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.signupFormGroup();
  }

  signupFormGroup(): void {
    this.signupForm = this.fb.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      phoneNo: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("[0-9]{10}"),
        ]),
      ],
      email: ["", Validators.compose([Validators.email, Validators.required])],
      password: [
        "",
        Validators.compose([Validators.required, Validators.minLength(6)]),
      ],
      confirmPassword: ["", Validators.required],
    });
  }
  

  signUp(): any {
    if (this.signupForm.invalid) {
      return false;
    } else {
      this.spinner.show();
      this.authServ.addUser(this.signupForm.value).subscribe(res => {
        if (res) {
          this.toastr.success("User created successfully.");
          this.spinner.hide();
          this.router.navigateByUrl('/login').catch();
        }
      }, (error) => {
        console.log(error);
        this.toastr.error(error.error.MESSAGE);
        this.spinner.hide();
      });
    }
  }

  guestLogin(): void {
    this.authService.guestUserLogin();
  }

  async googleAuth() {
    const route = localStorage.getItem("last-route");
    this.googleUserInfo = await this.socialAuthService.signIn(
      GoogleLoginProvider.PROVIDER_ID
    );

    this.spinner.show();
    this.authService.googleAuth(this.googleUserInfo.idToken).subscribe(
      async (res) => {
        this.spinner.hide();
        if (route) {
          this.router.navigateByUrl(route);
        } else {
          this.router.navigate(["/dashboard"]);
        }
        this.userStateService.setUserState(11 as any);
        this.socialAuthService.signOut();
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
