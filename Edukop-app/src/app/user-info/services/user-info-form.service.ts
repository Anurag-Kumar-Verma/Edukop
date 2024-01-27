import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as interfaces from '@spundan-clients/bookz-interfaces';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';

import { AuthService } from '../../auth/services/auth.service';

@Injectable({
    providedIn: 'root',
})
export class UserInfoFormService {
    constructor(public auth: AuthService, public http: HttpClient) {}

    userInfo(
        params: interfaces.IUser
    ): Observable<interfaces.IResponseGet<interfaces.IUser>> {
        return this.http.post<interfaces.IResponseGet<interfaces.IUser>>(
            environment.Api + `/api/userInfo`,
            params,
            {
                headers: this.auth.headers,
            }
        );
    }

    uploadUserImage(
        formData: FormData
    ): Observable<interfaces.IResponseGet<interfaces.IUser>> {
        return this.http.post<interfaces.IResponseGet<interfaces.IUser>>(
            environment.Api + `/test`,
            formData,
            {
                headers: this.auth.imageHeaders,
            }
        );
    }
}
