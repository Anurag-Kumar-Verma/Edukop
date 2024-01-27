import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as interfaces from '@spundan-clients/bookz-interfaces';
import { IResponsePaginationGet } from '@spundan-clients/bookz-interfaces';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';

interface ExamResponse<T> {
    docs: T;
}

@Injectable({
    providedIn: 'root',
})
export class CategoriesService {
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

    getBoards(): Observable<IResponsePaginationGet<interfaces.IBoard>> {
        return this.http.get<IResponsePaginationGet<interfaces.IBoard>>(
            environment.Api + '/api/boards?size=100&page=1',
            {
                headers: this.authService.headers,
            }
        );
    }

    getUniversity(): Observable<IResponsePaginationGet<interfaces.IUniversity>> {
        return this.http.get<IResponsePaginationGet<interfaces.IUniversity>>(
            environment.Api + '/api/university?size=100&page=1',
            {
                headers: this.authService.headers,
            }
        );
    }

    getBoard(): Observable<IResponsePaginationGet<interfaces.IBoard>> {
        return this.http.get<IResponsePaginationGet<interfaces.IBoard>>(
            environment.Api + '/api/',
            {
                headers: this.authService.headers,
            }
        );
    }

    getSchool(filter: string): Observable<IResponsePaginationGet<interfaces.ISchool>> {
        return this.http.get<IResponsePaginationGet<interfaces.ISchool>>(
            environment.Api + '/' + filter,
            {
                headers: this.authService.headers,
            }
        );
    }

    getExamCategory(): Observable<ExamResponse<interfaces.ICompetitionExamCategory[]>> {
        return this.http.get<ExamResponse<interfaces.ICompetitionExamCategory[]>>(
            environment.Api + '/api/exam-categories',
            {
                headers: this.authService.headers,
            }
        );
    }

    getEnrollments(
        filter: string
    ): Observable<IResponsePaginationGet<interfaces.IDynamicForm[]>> {
        return this.http.get<IResponsePaginationGet<interfaces.IDynamicForm[]>>(
            environment.Api + `/api/enrollments${filter}`,
            {
                headers: this.authService.headers,
            }
        );
    }
}
