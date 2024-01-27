import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as interfaces from "@spundan-clients/bookz-interfaces";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { AuthService } from "../auth/auth.service";

interface IBrowsingHistory {
  DATA: {
    searchString: string[];
    products: interfaces.IProduct;
  };
}

@Injectable({
  providedIn: "root",
})
export class DashboardService {
  constructor(public authService: AuthService, private http: HttpClient) {}

  getSection(): Observable<interfaces.IResponseGet<interfaces.ISection>> {
    const param = "IT";
    return this.http.get<interfaces.IResponseGet<interfaces.ISection>>(
      environment.Api + `/api/collectionByIdentyfier?identifier=${param}`,
      {
        headers: this.authService.headers,
      }
    );
  }

  getSectionSchool(): Observable<
    interfaces.IResponseGet<interfaces.ICollection>
  > {
    const param = "Dashboard-1";
    return this.http.get<interfaces.IResponseGet<interfaces.ICollection>>(
      environment.Api + `/api/collectionByIdentyfier?identifier=${param}`,
      {
        headers: this.authService.headers,
      }
    );
  }

  getSectionUniversities(): Observable<
    interfaces.IResponseGet<interfaces.ISection>
  > {
    const param = "Top Universities";
    return this.http.get<interfaces.IResponseGet<interfaces.ISection>>(
      environment.Api + `/api/collectionByIdentyfier?identifier=${param}`,
      {
        headers: this.authService.headers,
      }
    );
  }

  getAllSections(): Observable<interfaces.IResponseGet<interfaces.ISection[]>> {
    return this.http.get<interfaces.IResponseGet<interfaces.ISection[]>>(
      environment.Api + `/api/collections`,
      {
        headers: this.authService.headers,
      }
    );
  }

  getCart(): Observable<interfaces.IResponseGet<interfaces.ICart>> {
    return this.http.get<interfaces.IResponseGet<interfaces.ICart>>(
      environment.Api + `/api/cart`,
      {
        headers: this.authService.headers,
      }
    );
  }

  getRecentProducts(): Observable<
    interfaces.IResponseGet<interfaces.IBrowsingHistory>
  > {
    return this.http.get<interfaces.IResponseGet<interfaces.IBrowsingHistory>>(
      environment.Api + "/api/userHistories",
      {
        headers: this.authService.headers,
      }
    );
  }

  // getBanners(): Observable<any> {
  //     return this.http.get(environment.Api + '/api/banners', {
  //         headers: this.authService.headers,
  //     });
  // }

  getCategory(): Observable<interfaces.ITopCategories[]> {
    return this.http.get<interfaces.ITopCategories[]>(
      environment.Api + "/api/top-categories",
      {
        headers: this.authService.headers,
      }
    );
  }

  // getSectionDATA(param: string): Observable<any> {
  //     return this.http.get(
  //         environment.Api + `/api/collectionByIdentyfier?identifier=${param}`,
  //         {
  //             headers: this.authService.headers,
  //         }
  //     );
  // }

  getSectionofCollection(
    param: string
  ): Observable<interfaces.IResponseGet<interfaces.ISection>> {
    return this.http.get<interfaces.IResponseGet<interfaces.ISection>>(
      environment.Api + `/api/sectionByIdentifier?identifier=${param}`,
      {
        headers: this.authService.headers,
      }
    );
  }

  getCollectionById(uuid: string): Observable<interfaces.ICollection> {
    return this.http.get<interfaces.ICollection>(
      environment.Api + `/api/collectionByUUID?uuid=${uuid}`,
      {
        headers: this.authService.headers,
      }
    );
  }
}
