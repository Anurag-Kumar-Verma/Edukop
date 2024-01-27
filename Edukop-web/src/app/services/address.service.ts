import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as interfaces from "@spundan-clients/bookz-interfaces";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { AuthService } from "../auth/auth.service";
import { Address } from "../model/IAddress.model";

@Injectable({
  providedIn: "root",
})
export class AddressService {
  constructor(private http: HttpClient, public auth: AuthService) {}

  addAddress(
    params: interfaces.IAddress
  ): Observable<interfaces.IResponseGet<interfaces.IAddress>> {
    return this.http.post<interfaces.IResponseGet<interfaces.IAddress>>(
      environment.Api + `/api/address`,
      params,
      {
        headers: this.auth.headers,
      }
    );
  }

  getAddress(): Observable<interfaces.IResponseGet<Address[]>> {
    return this.http.get<interfaces.IResponseGet<Address[]>>(
      environment.Api + `/api/address`,
      {
        headers: this.auth.headers,
      }
    );
  }

  getAddressById(
    param: string
  ): Observable<interfaces.IResponseGet<interfaces.IAddress>> {
    return this.http.get<interfaces.IResponseGet<interfaces.IAddress>>(
      environment.Api + `/api/oneAddress?uuid=${param}`,
      {
        headers: this.auth.headers,
      }
    );
  }

  getDefaultAddress(): Observable<
    interfaces.IResponseGet<interfaces.IAddress>
  > {
    return this.http.get<interfaces.IResponseGet<interfaces.IAddress>>(
      environment.Api + `/api/defaultAddress`,
      {
        headers: this.auth.headers,
      }
    );
  }

  updateAddress(
    param: interfaces.IAddress
  ): Observable<interfaces.IResponseGet<interfaces.IAddress>> {
    return this.http.put<interfaces.IResponseGet<interfaces.IAddress>>(
      environment.Api + `/api/address`,
      param,
      {
        headers: this.auth.headers,
      }
    );
  }

  selectDefaultAddress(
    id: string
  ): Observable<interfaces.IResponseGet<interfaces.IAddress>> {
    return this.http.put<interfaces.IResponseGet<interfaces.IAddress>>(
      environment.Api + `/api/defaultAddress`,
      { uuid: id },
      {
        headers: this.auth.headers,
      }
    );
  }

  deleteAddress(
    uuid: string
  ): Observable<interfaces.IResponseGet<interfaces.IAddress>> {
    return this.http.put<interfaces.IResponseGet<interfaces.IAddress>>(
      environment.Api + `/api/delete-address`,
      { uuid },
      {
        headers: this.auth.headers,
      }
    );
  }
}
