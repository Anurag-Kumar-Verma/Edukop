import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';

import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class RecentProductService {
    constructor(public http: HttpClient, public authService: AuthService) {}

    // productRecent(): Observable<any> {
    //     return this.http.get(environment.Api + '/api/userHistories', {
    //         headers: this.authService.headers,
    //     });
    // }
}
