import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "src/app/auth/services/auth.service";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})

export class forgotPasswordService {
    constructor(
        private authServ: AuthService,
        public http: HttpClient
    ){}

    setPassword(data: object): Observable<any>{
        return this.http.post<any>(environment.Api + `/api/setNewPassword`, data, {
            headers: this.authServ.headers
        });
    }

    sendOtp(data: object): Observable<any>{
        return this.http.post<any>(environment.Api + `/api/sendOtp`, data, {
            headers: this.authServ.headers
        });
    }

    verifyOtp(data: object): Observable<any>{
        return this.http.post<any>(environment.Api + `/api/verifyOtp`, data, {
            headers: this.authServ.headers
        });
    }
}