import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as interfaces from '@spundan-clients/bookz-interfaces';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class MyAccountService {
    constructor(public http: HttpClient, public authService: AuthService) {}

    // getUserInfo(): Observable<any> {
    //     return this.http.get(environment.Api + '/api/userInfo', {
    //         headers: this.authService.headers,
    //     });
    // }
}
