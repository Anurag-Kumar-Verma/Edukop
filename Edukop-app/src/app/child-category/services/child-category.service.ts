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
export class ChildCategoryService {
    constructor(
        private router: Router,
        private http: HttpClient,
        public authService: AuthService
    ) {}

    getStandards(): Observable<
        interfaces.IResponsePaginationGet<interfaces.IStandard[]>
    > {
        return this.http.get<
            interfaces.IResponsePaginationGet<interfaces.IStandard[]>
        >(environment.Api + '/api/standards?size=100&page=1', {
            headers: this.authService.headers,
        });
    }

    getCourses(
        paginate: interfaces.IPaginate
    ): Observable<interfaces.IResponsePaginationGet<interfaces.ICourse[]>> {
        return this.http.get<
            interfaces.IResponsePaginationGet<interfaces.ICourse[]>
        >(
            environment.Api +
                `/api/courses?size=${paginate.pageSize}&page=${paginate.pageIndex}`,
            {
                headers: this.authService.headers,
            }
        );
    }

    getExam(
        id: string
    ): Observable<interfaces.IResponsePaginationGet<interfaces.IExam[]>> {
        return this.http.get<
            interfaces.IResponsePaginationGet<interfaces.IExam[]>
        >(environment.Api + `/api/competitionByType?type=${id}`, {
            headers: this.authService.headers,
        });
    }

    // getExams(paginate: any): Observable<any> {
    //     return this.http.get(
    //         environment.Api +
    //             `/api/exams?size=${paginate.size}&page=${paginate.page}`,
    //         {
    //             headers: this.authService.headers,
    //         }
    //     );
    // }
}
