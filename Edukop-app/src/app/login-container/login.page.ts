import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import {
    AlertController,
    IonSlides,
    ModalController,
    NavController,
    Platform,
    ToastController,
} from '@ionic/angular';
import * as interfaces from '@spundan-clients/bookz-interfaces';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/services/auth.service';
import { DashboardService } from '../dashboard/service/dashboard.service';
import { LoaderService } from '../shared/loader/loader.service';
import { RouteService } from '../shared/services/router.service';
import { ToastService } from '../shared/services/toast.service';
import { CartStateService } from '../shared/state/cart.state';
import { UserStateService } from '../shared/state/user-info.state';
import { SignupService } from '../signup-container/services/signup.service';
import { DOCUMENT } from '@angular/common';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { SharedService } from '../shared/services/shared.service';


@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  @ViewChild("mySlider") slides: IonSlides;
  @ViewChild("ngOtpInput", { static: false }) ngOtpInput: any;
  OTP: string = "";
  showOTPInput: boolean = false;
  OTPmessage: string;
  isGuest: boolean;
  path: string;
  showPassword: boolean = false;
  passwordToggleIcon: string = "eye-outline";
  interval;
  timeLeft: number;
  timerStart: boolean;
  otpResponse: any;
  otpRetry: number = 0;
  backRoute: string;
  isPhone: boolean;
  isCordova: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  googleUserInfo: any;
  loginEye: boolean = false;
  isOTPLogin: boolean = false;
  userDetails: any;
  constructor(
    @Inject(DOCUMENT) private document: Document,
    public modalController: ModalController,
    public alertController: AlertController,
    public toastController: ToastController,
    private fb: FormBuilder,
    public router: Router,
    private authService: AuthService,
    public loadingService: LoaderService,
    public navCtrl: NavController,
    private signupService: SignupService,
    private facebook: Facebook,
    private toasterService: ToastService,
    private userStateService: UserStateService,
    public routeService: RouteService,
    public dashboardService: DashboardService,
    public cartStateService: CartStateService,
    public platform: Platform,
    public sharedService: SharedService
  ) {
    this.isAndroid = platform.is("android");
    this.isCordova = platform.is("mobileweb");
    console.log(this.isCordova);
    this.isIOS = platform.is("ios");
    GoogleAuth.initialize();
  }
  loginForm: FormGroup;
  signupForm: FormGroup;
  submitAttempt: boolean;
  isLoading: boolean;
  userData: interfaces.IGoogleResponse;

  ngOnInit(): void {
    let url1: string[] = this.router.url.split("/");
    const route = localStorage.getItem("last-route");
    this.backRoute = localStorage.getItem("back-route");
    // if(localStorage.getItem('isSignUp') == 'true'){
    //     this.logInViaOTP();
    //     localStorage.removeItem('back-route');
    //     }else{
    if (route === "/tab/my-account") {
      this.path = "to check your Account";
    } else if (route === "/tab/my-orders") {
      this.path = "to see your Orders";
    } else if (route === "/tab/wishlist/" + url1[3]) {
      this.path = "to see your Wishlist";
    } else if (
      route === "/tab/buy-now/" + url1[3] ||
      route === "/tab/cart/" + url1[3]
    ) {
      this.path = "to place Order";
    }
    // }

    this.isGuest = this.authService.currentGuestUserValue;
    this.loginFormGroup();
    if (this.isOTPLogin) {
      this.loginForm.addControl("password", new FormControl('', Validators.required));
    } else {
      this.loginForm.removeControl("password");
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
    this.passwordToggleIcon =
      this.passwordToggleIcon === "eye-outline"
        ? "eye-off-outline"
        : "eye-outline";
  }

  async Toast(msg: string, toastClass: string): Promise<void> {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      position: "bottom",
      cssClass: toastClass,
    });
    await toast.present().catch();
  }

  async loginToast(): Promise<void> {
    const toast = await this.toastController.create({
      message: "Login Successfully",
      duration: 2000,
      position: "bottom",
    });
    toast.present().catch();
  }

  async resetPassword(): Promise<void> {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      subHeader: "Reset Password",
      inputs: [
        {
          name: "email",
          type: "text",
          placeholder: "Email",
        },
      ],
      buttons: [
        { text: "Cancel" },
        {
          text: "Ok",
          role: "Ok",
        },
      ],
    });
    await alert.present();
  }

  async alterPassword(msg: string): Promise<void> {
    const alert = await this.alertController.create({
      // cssClass: "my-custom-class",
      subHeader: msg,
    });
    await alert.present();
  }

  loginFormGroup(): void {
    this.loginForm = this.fb.group({
      email: ["",Validators.compose([ Validators.required, Validators.email])],
      password: ["", Validators.required],
    });
  }

  onInputTime(e) {
    if (Number(this.loginForm.controls.email.value)) {
      this.loginForm.controls["email"].setValidators(
        Validators.pattern("^[6-9][0-9]{9}$")
      );
    } else if (!Number(this.loginForm.controls.email.value)) {
      this.loginForm.controls["email"].setValidators(Validators.email);
    } else {
      this.loginForm.controls["email"].setValidators(Validators.required);
    }
  }

  getCarts(): void {
    this.dashboardService.getCart().subscribe((res) => {
      if (res.DATA !== undefined && res.DATA !== null) {
        this.cartStateService.setCartState(res.DATA.products.length);
      }
    });
  }

  signup() {
    this.router.navigateByUrl("/signup");
  }

  loginWithPassword() {
    this.isOTPLogin = !this.isOTPLogin;
    if (this.isOTPLogin) {
      this.loginForm.addControl("password", new FormControl('', Validators.required));
    } else {
      this.loginForm.removeControl("password");
    }
    this.showOTPInput = false;
  }

  signIn(action: string): void {
    if (action === "signup") {
      this.slides.slideNext().catch();
    } else {
      this.slides.slidePrev().catch();
    }
  }

  goback(): void {
    // if(this.userDetails?.isVerified){
    this.routeService.navigateToBack("ionic");
    // }else if(!this.userDetails){
    //     this.navCtrl.back();
    // }else{
    //     this.timerStart = false;
    //     this.showOTPInput = false;
    // }
    // let route = localStorage.getItem('last-route');
    // if (route) {
    //     if (route === '/buy-now') {
    //         route = '/product-page';
    //         this.navCtrl.navigateBack(route).catch();
    //     } else if (route === '/cart') {
    //         this.navCtrl.navigateRoot(route).catch();
    //     } else {
    //         this.navCtrl.navigateRoot('/tab/dashboard').catch();
    //     }
    // } else {
    //     this.navCtrl.navigateRoot('/tab/dashboard').catch();
    // }
    // localStorage.removeItem('last-route');
    // localStorage.removeItem('guest-route');
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
    if (this.checkIfEmailInString(this.loginForm.controls.email.value)) {
      this.OTPmessage =
        "An OTP is sent to your email " +
        this.loginForm.controls.email.value +
        ".";

      this.isPhone = false;
    } else if (
      this.checkIfPhoneNoInString(this.loginForm.controls.email.value)
    ) {
      this.isPhone = true;
      this.OTPmessage =
        "An OTP is sent to your number +91" +
        this.loginForm.controls.email.value;
      //    this.start();
    }
    this.authService
      .otpSend(this.isPhone, this.loginForm.controls.email.value)
      .subscribe((res) => {
        if (res) {
          this.Toast(res.MESSAGE, 'success').catch();
          this.timerStart = true;
          this.showOTPInput = true;
          this.ngOtpInput = '';
          this.timeLeft = 120;
          this.startTimer();
          this.otpResponse = res.DATA;
          this.Toast(this.OTPmessage, 'success');
        }
      }, (error) => {
        this.Toast(error.error.MESSAGE, 'error').catch();
      });
  }

  logIn(): void {
    // this.showOTPInput = true;
    if (this.isOTPLogin) {
      if (this.checkIfEmailInString(this.loginForm.controls.email.value)) {
        this.OTPmessage =
          "An OTP is sent to your number - +91" +
          this.loginForm.controls.email.value +
          ".";
      } else if (
        this.checkIfPhoneNoInString(this.loginForm.controls.email.value)
      ) {
        this.OTPmessage =
          "An OTP is sent to your Email - " +
          this.loginForm.controls.email.value +
          ".";
      }

      const route = localStorage.getItem("last-route") || "/tab/dashboard";

      this.loadingService.display(true);
      if (this.loginForm.invalid) {
        this.submitAttempt = true;
        return;
      }
      // const user : AuthUser ={ email: this.loginForm.controls.email.value, password: this.loginForm.controls.password.value}
      this.authService
        .emailLogin(
          this.loginForm.controls.email.value,
          this.loginForm.controls.password.value
        )
        .subscribe(
          (response) => {
            this.loadingService.display(true);
            if (response.token.length > 0) {
              this.sharedService.getUserInfo().subscribe(
                (response: any) => {
                  this.userDetails = response.DATA;
                  this.loadingService.display(false);
                  if (this.userDetails.isVerified) {
                    this.navCtrl.navigateForward(route).catch();
                    this.userStateService.setUserState(11);
                    localStorage.removeItem("last-route");
                    this.loginToast().catch();
                  } else {
                    this.logInViaOTP();
                  }
                },
                (error) => {
                  this.loadingService.display(false);
                }
              );
            } else {
              this.Toast('Wrong email', 'error').catch();
            }
            // this.loadingService.display(false);
          },
          (error) => {
            this.Toast(error.error, 'error').catch();
            this.loadingService.display(false);
            // this.loaderService.display(false);
            // this.toastr.error('Failed');
          }
        );
      // this.router.navigateByUrl("/dashboard");
    } else {
      this.logInViaOTP();
    }
  }

  async googleAuth() {
    if (this.isCordova) {
      const route = localStorage.getItem("last-route");
      GoogleAuth.signIn()
        .then((result) => {
          this.googleUserInfo = result;
          this.authService.googleAuth(result.authentication.idToken).subscribe(
            async () => {
              this.getCarts();
              this.loginToast().catch();
              this.loadingService.display(false);
              if (route) {
                this.router.navigateByUrl(route);
              } else {
                this.navCtrl.navigateRoot("/tab/dashboard");
              }
              this.userStateService.setUserState(11);
              localStorage.removeItem("last-route");
            },
            (error) => {
              this.toasterService
                .showToast(JSON.stringify(error), "start")
                .catch();
            }
          );
        })
        .catch((err) => {
          console.log(err, "wev catch");
        });
    } else {
      const route = localStorage.getItem("last-route");
      GoogleAuth.initialize();
      GoogleAuth.signIn()
        .then((result) => {
          this.googleUserInfo = result;
          this.authService.googleAuth(result.authentication.idToken).subscribe(
            async () => {
              this.getCarts();
              this.loginToast().catch();
              this.loadingService.display(false);
              if (route) {
                this.router.navigateByUrl(route);
              } else {
                this.navCtrl.navigateRoot("/tab/dashboard");
              }
              this.userStateService.setUserState(11);
              localStorage.removeItem("last-route");
            },
            (error) => {
              this.toasterService
                .showToast(JSON.stringify(error), "start")
                .catch();
            }
          );
        })
        .catch((err) => {
          console.log(err, "app catch");
        });
    }
  }
  // googleAuth(): void {
  //     this.loadingService.display(true);
  //     const route = localStorage.getItem('last-route');
  //     console.log(environment.webClientId)
  //     this.googlePlus
  //         .login({
  //             scope:
  //                 'https://www.googleapis.com/auth/contacts.readonly profile email',
  //             webClientId: environment.webClientId,
  //             offline: true,
  //         })
  //         .then((result: interfaces.IGoogleResponse) => {
  //             console.log(result)
  //             this.userData = result;
  //             this.authService.googleAuth(this.userData.idToken).subscribe(
  //                 async () => {
  //                     this.getCarts();
  //                     this.loginToast().catch();
  //                     await this.googlePlus.logout();
  //                     this.loadingService.display(false);
  //                     if (route) {
  //                         this.router.navigateByUrl(route);
  //                     } else {
  //                         this.navCtrl.navigateRoot('/tab/dashboard');
  //                     }
  //                     this.userStateService.setUserState(11);
  //                     localStorage.removeItem('last-route');
  //                 },
  //                 error => {
  //                     this.toasterService
  //                         .showToast(JSON.stringify(error), 'start')
  //                         .catch();
  //                 }
  //             );
  //         })
  //         .catch(err => {
  //             console.log(err)
  //             this.loadingService.display(false);
  //         });
  // }

  facebookAuth(): void {
    if (this.isCordova) {
      const route = localStorage.getItem("last-route");
      const WINDOW = this.document.defaultView as any;
      WINDOW.facebookConnectPlugin.browserInit("5101584633234492");
      WINDOW.facebookConnectPlugin.login(
        ["email"],
        (res) => {
          this.authService.facebookAuth(res.authResponse.accessToken).subscribe(
            async (result) => {
              this.getCarts();
              this.loginToast().catch();
              await this.facebook.logout();
              this.loadingService.display(false);
              if (route) {
                this.router.navigateByUrl(route);
              } else {
                this.navCtrl.navigateRoot("/tab/dashboard");
              }
              this.userStateService.setUserState(11);
              localStorage.removeItem("last-route");
            },
            (error) => {
              this.toasterService
                .showToast(JSON.stringify(error), "start")
                .catch();
            }
          );
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      const route = localStorage.getItem("last-route");
      this.loadingService.display(true);
      this.facebook
        .login(["public_profile"])
        .then((res: FacebookLoginResponse) => {
          if (res.status === "connected") {
            const userfbData = res.authResponse;
            this.authService.facebookAuth(userfbData.accessToken).subscribe(
              async (result) => {
                this.getCarts();
                this.loginToast().catch();
                await this.facebook.logout();
                this.loadingService.display(false);
                if (route) {
                  this.router.navigateByUrl(route);
                } else {
                  this.navCtrl.navigateRoot("/tab/dashboard");
                }
                this.userStateService.setUserState(11);
                localStorage.removeItem("last-route");
              },
              (error) => {
                this.toasterService
                  .showToast(JSON.stringify(error), "start")
                  .catch();
              }
            );
          }
        })
        .catch((err) => {
          this.loadingService.display(false);
        });
    }
  }

  onOtpChange(event: string): void {
    this.OTP = event;
  }
  async presentToast(message, show_button, position, duration): Promise<void> {
    const toast = await this.toastController.create({
      message,
      position,
      duration,
    });
    toast.present().catch();
  }

  // start(): void {
  //     SMSReceive.startWatch(
  //         () => {
  //             document.addEventListener('onSMSArrive', (e: any) => {
  //                 //                    console.log('onSMSArrive()');
  //                 const IncomingSMS = e.data;
  //                 // console.log('sms.address:' + IncomingSMS.address);
  //                 // console.log('sms.body:' + IncomingSMS.body);
  //                 /* Debug received SMS content (JSON) */
  //                 //  console.log(JSON.stringify(IncomingSMS));
  //                 this.processSMS(IncomingSMS);
  //             });
  //         },
  //         () => {
  //             // console.log('watch start failed');
  //         }
  //     );
  // }

  // stop() {
  //     SMSReceive.stopWatch(
  //         () => {
  //             //  console.log('watch stopped');
  //         },
  //         () => {
  //             // console.log('watch stop failed');
  //         }
  //     );
  // }

  // processSMS(data) {
  //     // Check SMS for a specific string sequence to identify it is you SMS
  //     // Design your SMS in a way so you can identify the OTP quickly i.e. first 6 letters
  //     // In this case, I am keeping the first 6 letters as OTP
  //     const message = data.body;
  //     //if (message && message.indexOf('enappd_starters') !== -1) {
  //     let msg = data.body.split(/(\d+)/);
  //     this.OTP = msg[1];
  //     this.ngOtpInput.setValue(msg[1]);
  //     this.OTPmessage = 'OTP received. Proceed to register';
  //     this.ValidateOTP();
  // }

  register(): void {
    if (this.OTP !== "") {
      this.presentToast(
        "You are successfully registered",
        false,
        "top",
        1500
      ).catch();
    } else {
      this.presentToast("Your OTP is not valid", false, "bottom", 1500).catch();
    }
  }

  // sendOtp(): void {
  //     this.authService.otpValidate(this.OTP).subscribe(res => {
  //         console.log(res);
  //     });
  // }

  startTimer(): void {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        if (this.timeLeft === undefined) {
          this.timeLeft = 120;
        } else {
          clearInterval(this.interval);
        }
      }
    }, 1000);
  }

  formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;

    if (seconds < 10) {
      seconds = Number(`0${seconds}`);
    }

    return `${minutes}:${seconds}`;
  }

  pauseTimer(): void {
    // you can use this function if you want restart timer
    clearInterval(this.interval);
    this.timeLeft = 60;
  }

  resendOTP(): void {
    this.otpRetry++;
    if (this.otpRetry > 2) {
      this.timeLeft = undefined;
    }
    clearTimeout(this.interval);
    this.timerStart = false;
    console.log(this.otpRetry, ": OtpRetry ", this.timeLeft, ": time left ", this.timerStart, ": timer start");
    this.logInViaOTP();
  }

  ValidateOTP(): void {
    const route = localStorage.getItem("last-route");
    this.loadingService.display(true);
    this.authService.otpValidate(this.otpResponse.uuid, this.OTP).subscribe(
      (res) => {
        // this.isPhone ? this.stop() : '';
        this.loadingService.display(false);
        if (res) {
          this.getCarts();
          if (
            this.backRoute === "/product-list" ||
            this.backRoute === "/product-page"
          ) {
            this.navCtrl.back();
          } else {
            if (route) {
              this.router.navigateByUrl(route);
            } else {
              this.navCtrl.navigateRoot("/tab/dashboard");
            }
          }
          this.userStateService.setUserState(11);
          localStorage.removeItem("last-route");
          this.loginToast().catch();
          this.toasterService
            .showToast("OTP Verified successfully", "end")
            .catch();
        } else {
          this.Toast('OTP Validation Failed', 'error');
        }
      },
      (error) => {
        //     this.stop();
        this.loadingService.display(false);
        this.Toast('OTP Validation Failed', 'error');
      }
    );
  }

  forgotPass() {
    this.router.navigateByUrl("/forgot-password");
  }
}
