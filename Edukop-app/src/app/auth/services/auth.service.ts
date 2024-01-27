import {
    HttpClient,
    HttpErrorResponse,
    HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { NavController } from '@ionic/angular';
import * as interfaces from '@spundan-clients/bookz-interfaces';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
// import { AuthUser } from "../models/auth-user.model";

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private currentUserSubject: BehaviorSubject<string>;
    private currentGuestUserSubject: BehaviorSubject<boolean>;
    currentUser: Observable<string>;
    headers: HttpHeaders;
    imageHeaders: HttpHeaders;

    constructor(
        private router: Router,
        private http: HttpClient,
        private navCtrl: NavController,
        private splashScreen: SplashScreen
    ) {
        this.currentUserSubject = new BehaviorSubject<string>(
            JSON.parse(localStorage.getItem('currentUser'))
        );
        this.currentGuestUserSubject = new BehaviorSubject<boolean>(
            JSON.parse(localStorage.getItem('isGuest'))
        );
        this.currentUser = this.currentUserSubject.asObservable();
        this.currentUserSubject.subscribe(val => {
            this.headers = new HttpHeaders({
                'Content-Type': 'application/json',
                authtoken: this.currentUserSubject.value,
            });
            this.imageHeaders = new HttpHeaders({
                authtoken: this.currentUserSubject.value,
            });
        });
    }

    get currentUserValue(): string {
        // tslint:disable-next-line: strict-boolean-expressions
        return this.currentUserSubject.value || undefined;
    }

    get currentGuestUserValue(): boolean {
        // tslint:disable-next-line: strict-boolean-expressions
        return this.currentGuestUserSubject.value || undefined;
    }

    emailLogin(
        email: string,
        password: string
    ): Observable<interfaces.ILoginResponse> {
        return this.http
            .post(environment.Api + '/api/login', { email, password })
            .pipe(
                map((user: interfaces.ILoginResponse) => {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem(
                        'currentUser',
                        JSON.stringify(user.token)
                    );
                    localStorage.setItem(
                        'isGuest',
                        JSON.stringify(user.payload.isGuest)
                    );
                    localStorage.setItem(
                        'userPayload',
                        JSON.stringify(user.payload)
                    );
                    // localStorage.setItem("userName", JSON.stringify(username));
                    console.log(user);
                    this.currentGuestUserSubject.next(user.payload.isGuest);
                    this.currentUserSubject.next(user.token);
                    return user;
                })
            );
    }

    // email: "vijay996@dispostable.com"
    // firstName: "Vijay"
    // isDeleted: false
    // isGuest: false
    // isVerified: false
    // lastName: "Dhakad"
    // password: "$2b$10$SL7v7WQB6AtrY0bIBA3FT.CnE3JZQyQfqNB1XClWw9bEwI9jYXPju"
    // phoneNo: "8989755513"
    // role: "user"
    // uuid: "a2e5412c-f581-4f6a-85dd-edb98eca3a62"
    // _id: "642d12cfd817df0007fb85d2"

    googleAuth(token: string): Observable<interfaces.IGoogleResponse | object> {
        const param = {
            token,
        };
        console.log(param)
        return this.http.post(environment.Api + '/auth/google', param).pipe(
            map((user: interfaces.ILoginResponse) => {
                console.log(user)
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(user.token));
                // localStorage.setItem("userName", JSON.stringify(username));
                localStorage.setItem(
                    'isGuest',
                    JSON.stringify(user.payload.isGuest)
                );
                localStorage.setItem(
                    'userPayload',
                    JSON.stringify(user.payload)
                );
                this.currentGuestUserSubject.next(user.payload.isGuest);
                this.currentUserSubject.next(user.token);
                return user || {};
            }),
            catchError(this.handleError)
        );
    }

    facebookAuth(token: string): Observable<Response | {}> {
        const param = {
            access_token: token,
        };
        return this.http.post(environment.Api + '/auth/facebook', param).pipe(
            map((user: interfaces.ILoginResponse) => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(user.token));
                // localStorage.setItem("userName", JSON.stringify(username));
                localStorage.setItem(
                    'isGuest',
                    JSON.stringify(user.payload.isGuest)
                );
                // localStorage.setItem("userName", JSON.stringify(username));
                this.currentGuestUserSubject.next(user.payload.isGuest);
                this.currentUserSubject.next(user.token);
                return user || {};
            }),
            catchError(this.handleError)
        );
    }

    guestUser(): Observable<interfaces.ILoginResponse | {}> {
        return this.http.get(environment.Api + `/api/guestUser`).pipe(
            map((res: Response) => {
                return res || {};
            }),
            catchError(this.handleError)
        );
    }

    logout(): void {
        // remove user from local storage and set current user to null
        // localStorage.removeItem('currentUser');
        // localStorage.removeItem('isGuest');
        // localStorage.removeItem('last-route');
        // localStorage.removeItem('guest-route');
        localStorage.clear();
        this.currentUserSubject.next(undefined);
        this.currentGuestUserSubject.next(undefined);
        //   this.router.navigateByUrl('/login');
        this.guestUserLogin();
    }

    guestUserLogin(): void {
        if (this.currentUserValue === undefined) {
            this.guestUser().subscribe(res => {
                const email = atob(res['DATA'].email);
                const password = atob(res['DATA'].password);
                this.emailLogin(email, password).subscribe(response => {
                    window.location.reload();
                    this.splashScreen.hide();
                    if (response.token.length > 0) {
                        this.navCtrl
                            .navigateRoot('/tab/dashboard', {
                                animationDirection: 'forward',
                            })
                            .catch();
                    }
                });
            });
        }
    }

    otpValidate(
        id: string,
        OTP: string
    ): Observable<interfaces.ILoginResponse> {
        return this.http
            .post(environment.Api + '/api/verifyOtp', {
                uuid: id,
                otp: OTP,
            })
            .pipe(
                map((user: interfaces.ILoginResponse) => {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    if (user?.token) {
                        localStorage.setItem(
                            'currentUser',
                            JSON.stringify(user.token)
                        );
                        localStorage.setItem(
                            'userId',
                            JSON.stringify(user.payload.uuid)
                        );
                        localStorage.setItem(
                            'isGuest',
                            JSON.stringify(user.payload.isGuest)
                        );
                        // localStorage.setItem("userName", JSON.stringify(username));
                        this.currentGuestUserSubject.next(user.payload.isGuest);
                        this.currentUserSubject.next(user.token);
                    }
                    return user;
                })
            );
    }

    // tslint:disable-next-line: no-any
    otpSend(isPhone: boolean, mobileOrEmail: string): Observable<any> {
        return this.http
            .post(environment.Api + '/api/sendToMobile', {
                isMobile: isPhone,
                emailOrMobile: mobileOrEmail,
            })
            .pipe(
                map((user: interfaces.ILoginResponse) => {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    // localStorage.setItem(
                    //     'currentUser',
                    //     JSON.stringify(user.token)
                    // );
                    // localStorage.setItem(
                    //     'isGuest',
                    //     JSON.stringify(user.payload.isGuest)
                    // );
                    // // localStorage.setItem("userName", JSON.stringify(username));
                    // this.currentGuestUserSubject.next(user.payload.isGuest);
                    // this.currentUserSubject.next(user.token);
                    return user;
                })
            );
    }

    // Error
    handleError(error: HttpErrorResponse): Observable<never> {
        let msg = '';
        msg =
            error.error instanceof ErrorEvent
                ? error.error.message
                : `Error Code: ${error.status}\nMessage: ${error.message}`;
        return throwError(msg);
    }
}
