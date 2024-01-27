import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
    IBoard,
    ICompetition,
    ICompetitionExamCategory,
    IDynamicForm,
    IEnrollmentForm,
    IResponsePaginationGet,
    ISchool,
    IUniversity,
} from '@spundan-clients/bookz-interfaces';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import * as interfaces from '@spundan-clients/bookz-interfaces';
import { environment } from '../../../environments/environment';

interface ExamResponse<T> {
    docs: T;
}

@Injectable({
    providedIn: 'root',
})
export class SubCategoryService {
    constructor(
        private router: Router,
        private http: HttpClient,
        public authService: AuthService
    ) {}

    getBoards(): Observable<IResponsePaginationGet<IBoard>> {
        return this.http.get<IResponsePaginationGet<IBoard>>(
            environment.Api + '/api/boards?size=100&page=1',
            {
                headers: this.authService.headers,
            }
        );
    }

    getUniversity(): Observable<IResponsePaginationGet<IUniversity>> {
        return this.http.get<IResponsePaginationGet<IUniversity>>(
            environment.Api + '/api/university?size=100&page=1',
            {
                headers: this.authService.headers,
            }
        );
    }

    getBoard(): Observable<IResponsePaginationGet<IBoard>> {
        return this.http.get<IResponsePaginationGet<IBoard>>(
            environment.Api + '/api/',
            {
                headers: this.authService.headers,
            }
        );
    }

    getSchool(filter: string): Observable<IResponsePaginationGet<ISchool>> {
        return this.http.get<IResponsePaginationGet<ISchool>>(
            environment.Api + '/' + filter,
            {
                headers: this.authService.headers,
            }
        );
    }

    getExamCategory(): Observable<ExamResponse<ICompetitionExamCategory[]>> {
        return this.http.get<ExamResponse<ICompetitionExamCategory[]>>(
            environment.Api + '/api/exam-categories',
            {
                headers: this.authService.headers,
            }
        );
    }

    getEnrollments(
        filter: string
    ): Observable<IResponsePaginationGet<IDynamicForm[]>> {
        return this.http.get<IResponsePaginationGet<IDynamicForm[]>>(
            environment.Api + `/api/enrollments${filter}`,
            {
                headers: this.authService.headers,
            }
        );
    }
}
