import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { AuthService } from '../auth/services/auth.service';
import { LoaderService } from '../shared/loader/loader.service';
import { RouteService } from '../shared/services/router.service';
import { ToastService } from '../shared/services/toast.service';
import { UserStateService } from '../shared/state/user-info.state';

import { SignupService } from './services/signup.service';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.page.html',
    styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
    signupForm: FormGroup;
    isPasswordMatch: boolean = true;
    googleUserInfo: any;
    isCordova: boolean;
    isIOS: boolean;
    isAndroid: boolean;
    loginEye: boolean = false;
    confirmLoginEye: boolean = false;
    constructor(
        @Inject(DOCUMENT) private document: Document,
        public toastController: ToastController,
        private fb: FormBuilder,
        public router: Router,
        private authService: AuthService,
        private signupService: SignupService,
        private facebook: Facebook,
        public loadingService: LoaderService,
        public navCtrl: NavController,
        private toasterService: ToastService,
        private userStateService: UserStateService,
        public routeService: RouteService,
        public platform: Platform,
    ) {
        this.isAndroid = platform.is('android');
        this.isCordova = platform.is('mobileweb');
        console.log(this.isCordova)
        this.isIOS = platform.is('ios');
        GoogleAuth.initialize();

    }

    ngOnInit(): void {
        this.createSignupFormGroup();
    }

    async presentToast(msg:string): Promise<void> {
        const toast = await this.toastController.create({
            message: msg,
            duration: 2000,
        });
        toast.present().catch();
    }

    createSignupFormGroup(): void {
        this.signupForm = this.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            phoneNo: ['', Validators.required],
            email: ['', Validators.required],
            password: ['', Validators.required],
            confirmPassword: ['', Validators.required],
        });
    }

    signUp(): boolean {
        if (this.signupForm.invalid) {
            return true;
        }
        // localStorage.setItem('isSignUp', 'true');
        this.signupService.signup(this.signupForm.value).subscribe(res => {
            if (res) {
                if(res.DATA){
                    this.signupForm.reset();
                    this.router.navigateByUrl('/tab/login').catch();
                    this.presentToast('Sign-up Successfully').catch();
                }
                this.presentToast(res.MESSAGE);
            }
        }, (error) => {
            console.log(error);
            this.presentToast(error.error.MESSAGE);
        });
    }
    login(): void {
        this.router.navigateByUrl('/tab/login').catch();
    }
    userInfo(): void {
        // this.router.navigateByUrl("/user-info");
    }

    async googleAuth() {
        if (this.isCordova) {
        const route = localStorage.getItem('last-route');
        GoogleAuth.signIn().then(result => {
        this.googleUserInfo = result;
            console.log(result,"web")
            this.authService.googleAuth(result.authentication.idToken).subscribe(
                async () => {
                    const msg = "SignUp Successful.";
                    this.presentToast(msg).catch();
                    this.loadingService.display(false);
                    if (route) {
                        this.router.navigateByUrl(route);
                    } else {
                        this.navCtrl.navigateRoot('/tab/dashboard');
                    }
                    this.userStateService.setUserState(11);
                    localStorage.removeItem('last-route');
                },
                error => {
                    this.toasterService
                        .showToast(JSON.stringify(error), 'start')
                        .catch();
                })
        }).catch((err)=>{
            const msg = "SignUp Fail.";
            this.presentToast(msg).catch();
            console.log(err,"wev catch")
        })
            
    } else {
            const route = localStorage.getItem('last-route');
            GoogleAuth.initialize()
             GoogleAuth.signIn().then(result => {
                this.googleUserInfo = result;
                console.log(result,"app")
                this.authService.googleAuth(result.authentication.idToken).subscribe(
                    async () => {
                        const msg = "SignUp Successful.";
                        this.presentToast(msg).catch();
                        this.loadingService.display(false);
                        if (route) {
                            this.router.navigateByUrl(route);
                        } else {
                            this.navCtrl.navigateRoot('/tab/dashboard');
                        }
                        this.userStateService.setUserState(11);
                        localStorage.removeItem('last-route');
                    },
                    error => {
                        this.toasterService
                            .showToast(JSON.stringify(error), 'start')
                            .catch();
                    })
            }).catch((err)=>{
                const msg = "SignUp Fail.";
                this.presentToast(msg).catch();
                console.log(err,"app catch")
            })
        }
    }

    facebookAuth(): void {
        if (this.isCordova) {
            const route = localStorage.getItem('last-route');
            const WINDOW = (this.document.defaultView as any);
            WINDOW.facebookConnectPlugin.browserInit('5101584633234492');
            WINDOW.facebookConnectPlugin.login(['email'],
                res => {
                    this.authService.facebookAuth(res.authResponse.accessToken).subscribe(
                        async result => {
                            const msg = "SignUp Successful.";
                            this.presentToast(msg).catch();
                            await this.facebook.logout();
                            this.loadingService.display(false);
                            if (route) {
                                this.router.navigateByUrl(route);
                            } else {
                                this.navCtrl.navigateRoot('/tab/dashboard');
                            }
                            this.userStateService.setUserState(11);
                            localStorage.removeItem('last-route');
                        },
                        error => {
                            this.toasterService
                                .showToast(JSON.stringify(error), 'start')
                                .catch();
                        }
                    );
                },
                err => {
                    console.log(err);
                })
        } else {
            const route = localStorage.getItem('last-route');
            this.loadingService.display(true);
            this.facebook.login(['public_profile']).then((res: FacebookLoginResponse) => {
                if (res.status === 'connected') {
                    const userfbData = res.authResponse;
                    this.authService.facebookAuth(userfbData.accessToken).subscribe(
                        async result => {
                            const msg = "SignUp Successful.";
                            this.presentToast(msg).catch();
                            await this.facebook.logout();
                            this.loadingService.display(false);
                            if (route) {
                                this.router.navigateByUrl(route);
                            } else {
                                this.navCtrl.navigateRoot('/tab/dashboard');
                            }
                            this.userStateService.setUserState(11);
                            localStorage.removeItem('last-route');
                        },
                        error => {
                            this.toasterService
                                .showToast(JSON.stringify(error), 'start')
                                .catch();
                        }
                    );
                }
            })
                .catch(err => {
                    const msg = "SignUp Fail.";
                    this.presentToast(msg).catch();
                    this.loadingService.display(false);
                });
        }
    }
}
