import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as interfaces from "@spundan-clients/bookz-interfaces";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { AuthService } from "../auth/auth.service";

interface SaveAnswer {
  answers: interfaces.IAnswerState[];
  myEnrollmentId: string;
}

interface SaveAnswerResponse {
  inserted: interfaces.IAnswerState[];
  updated: interfaces.IAnswerState[];
}

@Injectable({
  providedIn: "root",
})
export class DynamicFormService {
  constructor(private http: HttpClient, public authService: AuthService) {}

  getDynamicFormBySchoolId(
    id: string
  ): Observable<interfaces.IResponseGet<interfaces.IDynamicForm>> {
    return this.http.get<interfaces.IResponseGet<interfaces.IDynamicForm>>(
      environment.Api + `/api/enrollment?org_id=${id}`,
      {
        headers: this.authService.headers,
      }
    );
  }

  getDynamicFormByEnrollmentId(
    id: string
  ): Observable<interfaces.IResponseGet<interfaces.IDynamicForm>> {
    return this.http.get<interfaces.IResponseGet<interfaces.IDynamicForm>>(
      environment.Api + `/api/enrollment?enrollmentId=${id}`,
      {
        headers: this.authService.headers,
      }
    );
  }

  saveAnswer(
    params: SaveAnswer
  ): Observable<interfaces.IResponseGet<SaveAnswerResponse>> {
    return this.http.post<interfaces.IResponseGet<SaveAnswerResponse>>(
      environment.Api + "/api/answer",
      params,
      {
        headers: this.authService.headers,
      }
    );
  }

  getAnswer(
    myEnrollMentid: string
  ): Observable<interfaces.IResponsePaginationGet<interfaces.IAnswerState[]>> {
    return this.http.get<
      interfaces.IResponsePaginationGet<interfaces.IAnswerState[]>
    >(environment.Api + "/api/answers/" + myEnrollMentid, {
      headers: this.authService.headers,
    });
  }

  getMyEnrollments(
    orderUUID: string
  ): Observable<
    interfaces.IResponsePaginationGet<interfaces.IMyEnrollments[]>
  > {
    return this.http.get<
      interfaces.IResponsePaginationGet<interfaces.IMyEnrollments[]>
    >(environment.Api + `/api/myEnrollments?orderUUID=${orderUUID}`, {
      headers: this.authService.headers,
    });
  }

  updateMyEnrollmentFormStatus(
    param: string
  ): Observable<interfaces.IMyEnrollments> {
    return this.http.put<interfaces.IMyEnrollments>(
      environment.Api + `/api/myEnrollment`,
      { myEnrollmentId: param },
      {
        headers: this.authService.headers,
      }
    );
  }

  deleteRepeatFields(param: any): Observable<interfaces.IMyEnrollments> {
    return this.http.put<interfaces.IMyEnrollments>(
      environment.Api + `/api/deleteOneAnswer`,
      { answer: param },
      {
        headers: this.authService.headers,
      }
    );
  }

  downloadSubmittedForm(
    enrollmentFormId: string,
    myEnrollmentId: string
  ): Observable<Blob> {
    return this.http.get(
      environment.Api +
        `/api/enrollGenerate?enrollmentFormId=${enrollmentFormId}&myEnrollmentId=${myEnrollmentId}`,
      {
        responseType: "blob",
        headers: this.authService.headers,
      }
    );
  }


  getStates(): Observable<interfaces.IStates[]> {
    return this.http.get<interfaces.IStates[]>(environment.Api + `/api/city-states`);
  }

  getCities(param: string): Observable<string[]> {
    return this.http.get<string[]>(
      environment.Api + `/api/city?state=${param}`
    );
  }
}
