import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as interfaces from '@spundan-clients/bookz-interfaces';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { environment } from 'src/environments/environment';
export interface SearchDATA<T> {
    DATA: [
        {
            docs: T[];
        }
    ];
}

@Injectable({
    providedIn: 'root',
})
export class SearchService {
    constructor(private http: HttpClient, public auth: AuthService) {}

    search(
        params: object
    ): Observable<
        SearchDATA<
            | interfaces.IProduct
            | interfaces.IUniversity
            | interfaces.ISchool
            | interfaces.ICompetition
            | interfaces.IBoard
        >
    > {
        return this.http.post<
            SearchDATA<
                | interfaces.IProduct
                | interfaces.IUniversity
                | interfaces.ISchool
                | interfaces.ICompetition
                | interfaces.IBoard
            >
        >(environment.Api + `/dashboardSuggetion`, params, {
            headers: this.auth.headers,
        });
    }

    deleteSearchStringHistory(
        searchString: string
    ): Observable<interfaces.IResponseGet<interfaces.IBrowsingHistory>> {
        return this.http.put<
            interfaces.IResponseGet<interfaces.IBrowsingHistory>
        >(
            environment.Api + `/api/remove-one-searchString`,
            { search_string: searchString },
            {
                headers: this.auth.headers,
            }
        );
    }

    categorySearch(
        params: object
    ): Observable<interfaces.IResponseGet<interfaces.ISchool[]>> {
        return this.http.post<interfaces.IResponseGet<interfaces.ISchool[]>>(
            environment.Api + `/api/userSchoolSearch`,
            params,
            {
                headers: this.auth.headers,
            }
        );
    }
}
