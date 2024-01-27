import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as interfaces from '@spundan-clients/bookz-interfaces';
import { AuthService } from '../auth/auth.service';
import { environment } from 'src/environments/environment';
import { IDynamicForm } from '../model/IDynamicForm.model';

interface ExamResponse<T> {
    docs: T;
}

@Injectable({
    providedIn: 'root',
})
export class BoardService {
    constructor(
        private router: Router,
        private http: HttpClient,
        public authService: AuthService
    ) {}

    getBoards(): Observable<interfaces.IResponsePaginationGet<interfaces.IBoard>> {
        return this.http.get<interfaces.IResponsePaginationGet<interfaces.IBoard>>(
            environment.Api + '/api/boards?size=100&page=1',
            {
                headers: this.authService.headers,
            }
        );
    }

    getUniversity(): Observable<interfaces.IResponsePaginationGet<interfaces.IUniversity>> {
        return this.http.get<interfaces.IResponsePaginationGet<interfaces.IUniversity>>(
            environment.Api + '/api/university?size=100&page=1',
            {
                headers: this.authService.headers,
            }
        );
    }

    getBoard(): Observable<interfaces.IResponsePaginationGet<interfaces.IBoard>> {
        return this.http.get<interfaces.IResponsePaginationGet<interfaces.IBoard>>(
            environment.Api + '/api/',
            {
                headers: this.authService.headers,
            }
        );
    }

    getSchool(filter: string): Observable<interfaces.IResponsePaginationGet<interfaces.ISchool>> {
        return this.http.get<interfaces.IResponsePaginationGet<interfaces.ISchool>>(
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
    ): Observable<interfaces.IResponsePaginationGet<IDynamicForm[]>> {
        return this.http.get<interfaces.IResponsePaginationGet<IDynamicForm[]>>(
            environment.Api + `/api/enrollments${filter}`,
            {
                headers: this.authService.headers,
            }
        );
    }
}
