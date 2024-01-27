import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as interfaces from '@spundan-clients/bookz-interfaces';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';

import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AllCategories {
    constructor(
        private router: Router,
        private http: HttpClient,
        public authService: AuthService
    ) {}

    getCategoryTree(): Observable<interfaces.ICategoryTreeResponse[]> {
        return this.http.get<interfaces.ICategoryTreeResponse[]>(
            environment.Api + '/allcategories',
            {
                headers: this.authService.headers,
            }
        );
    }
}
