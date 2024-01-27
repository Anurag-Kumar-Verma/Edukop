import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Navigation, Router } from "@angular/router";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import * as interfaces from "@spundan-clients/bookz-interfaces";
import { environment } from "src/environments/environment";
import { NgxSpinnerService } from "ngx-spinner";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<string>;
  private currentGuestUserSubject: BehaviorSubject<boolean>;
  currentUser: Observable<string>;
  headers!: HttpHeaders;
  imageHeaders!: HttpHeaders;

  constructor(
    private router: Router,
    private http: HttpClient,
    public spinner: NgxSpinnerService
  ) {
    this.currentUserSubject = new BehaviorSubject<string>(
      JSON.parse(localStorage.getItem("currentUser") as string)
    );
    this.currentGuestUserSubject = new BehaviorSubject<boolean>(
      JSON.parse(localStorage.getItem("isGuest") as string)
    );
    this.headers = new HttpHeaders({
      "Content-Type": "application/json",
    });
    this.currentUser = this.currentUserSubject.asObservable();
    this.currentUserSubject.subscribe((val) => {
      this.headers = new HttpHeaders({
        authtoken: this.currentUserSubject.value || '',
      });
      this.imageHeaders = new HttpHeaders({
        authtoken: this.currentUserSubject.value,
      });
    });
  }

  get currentUserValue(): string {
    return this.currentUserSubject.value || "";
  }

  get currentGuestUserValue(): boolean {
    return this.currentGuestUserSubject.value || false;
  }

  public getToken(): string {
    return this.currentUserSubject.value || "";
  }

  addUser(data: object): Observable<interfaces.IRegister> {
    console.log(data);
    return this.http.post<interfaces.IRegister>(environment.Api + `/api/register`,data,{
      headers: this.headers,
    });
  }

  emailLogin(data: object): Observable<interfaces.ILoginResponse> {
    return this.http.post(environment.Api + "/api/login", data).pipe(
      map((user: any) => {
        localStorage.setItem("currentUser", JSON.stringify(user.token));
        localStorage.setItem("isGuest", JSON.stringify(user.payload.isGuest));
        //   localStorage.setItem("userName", JSON.stringify(username));
        this.currentGuestUserSubject.next(user.payload.isGuest);
        this.currentUserSubject.next(user.token);
        return user;
      })
    );
  }

  googleAuth(token: string): Observable<interfaces.IGoogleResponse | object> {
    const param = {
      token,
    };
    return this.http.post(environment.Api + "/auth/google", param).pipe(
      map((user: any) => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem("currentUser", JSON.stringify(user.token));
        localStorage.setItem("uuid", JSON.stringify(user.payload.uuid));
        localStorage.setItem("email", JSON.stringify(user.payload.email));
        localStorage.setItem("isGuest", JSON.stringify(user.payload.isGuest));
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
    return this.http.post(environment.Api + "/auth/facebook", param).pipe(
      map((user: any) => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem("currentUser", JSON.stringify(user.token));
        localStorage.setItem("uuid", JSON.stringify(user.payload.uuid));
        localStorage.setItem("email", JSON.stringify(user.payload.email));
        // localStorage.setItem("userName", JSON.stringify(username));
        localStorage.setItem("isGuest", JSON.stringify(user.payload.isGuest));
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
      map((res: any) => {
        return res || {};
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    localStorage.clear();
    this.currentUserSubject.next("");
    this.currentGuestUserSubject.next(false);
    this.router.navigateByUrl("/login");
  }

  guestUserLogin(): void {
    this.spinner.show();
    if (!this.currentUserValue) {
      this.guestUser().subscribe((res: any) => {
        const loginData = {
          email: atob(res["DATA"].email),
          password: atob(res["DATA"].password),
        };
        this.emailLogin(loginData).subscribe((response) => {
          if (response.token.length > 0) {
            this.router.navigate([`/dashboard`]).catch();
          }
        });
        this.spinner.hide();
      });
    }else {
      this.router.navigate([`/dashboard`]).catch();
    }
  }

  otpValidate(id: string, OTP: string): Observable<interfaces.ILoginResponse> {
    return this.http
      .post(environment.Api + "/api/verifyOtp", {
        uuid: id,
        otp: OTP,
      })
      .pipe(
        map((user: any) => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          if (user?.token) {
            localStorage.setItem("currentUser", JSON.stringify(user.token));
            localStorage.setItem("userId", JSON.stringify(user.payload.uuid));
            localStorage.setItem(
              "isGuest",
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
      .post(environment.Api + "/api/sendToMobile", {
        isMobile: isPhone,
        emailOrMobile: mobileOrEmail,
      })
      .pipe(
        map((user: any) => {
          return user;
        })
      );
  }

  // Error
  handleError(error: HttpErrorResponse): Observable<never> {
    let msg = "";
    msg =
      error.error instanceof ErrorEvent
        ? error.error.message
        : `Error Code: ${error.status}\nMessage: ${error.message}`;
    return throwError(msg);
  }
}
