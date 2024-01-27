import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "src/app/auth/services/auth.service";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})

export class changePasswordService {
    constructor(
        private authServ: AuthService,
        public http: HttpClient
    ){}

    changePassword(data: object): Observable<any>{
        return this.http.post<any>(environment.Api + `/api/changePassword`, data, {
            headers: this.authServ.headers
        });
    }
}