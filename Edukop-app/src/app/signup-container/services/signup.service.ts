import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as interfaces from '@spundan-clients/bookz-interfaces';
import { Observable } from 'rxjs';

// import { Product, GroupProduct } from "../models/product.model";
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/services/auth.service';
import { Signup } from '../model/signup.model';

@Injectable({
    providedIn: 'root',
})
export class SignupService {
    headers: HttpHeaders;
    constructor(private http: HttpClient, public auth: AuthService) {
        this.headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
    }

    signup(params: Signup): Observable<any> {
        return this.http.post<any>(
            environment.Api + `/api/register`,
            params,
            {
                headers: this.headers,
            }
        );
    }
}
