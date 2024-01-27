import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as interfaces from '@spundan-clients/bookz-interfaces';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ReturnService {
    constructor(private http: HttpClient, public auth: AuthService) {}

    requestReturn(
        params: object
    ): Observable<interfaces.IResponseGet<interfaces.IReturn>> {
        return this.http.post<interfaces.IResponseGet<interfaces.IReturn>>(
            environment.Api + `/api/return-order`,
            params,
            {
                headers: this.auth.headers,
            }
        );
    }

    requestCancel(
        params: object
    ): Observable<interfaces.IResponseGet<interfaces.IReturn>> {
        return this.http.post<interfaces.IResponseGet<interfaces.IReturn>>(
            environment.Api + `/api/cancel-order`,
            params,
            {
                headers: this.auth.headers,
            }
        );
    }
}
