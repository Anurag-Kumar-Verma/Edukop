import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as interfaces from '@spundan-clients/bookz-interfaces';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
    providedIn: 'root',
})
export class OrderService {
    constructor(private http: HttpClient, public auth: AuthService) {}

    getShippingDetails(
        id: string
    ): Observable<interfaces.IResponseGet<interfaces.IShipping>> {
        return this.http.get<interfaces.IResponseGet<interfaces.IShipping>>(
            environment.Api + `/api/shippingInfo?uuid=${id}`,
            {
                headers: this.auth.headers,
            }
        );
    }

    // tslint:disable-next-line: no-any
    downloadInvoice(id: string): Observable<any> {
        return this.http.get(
            environment.Api + `/api/invoiceGenerate?uuid=${id}`,
            {
                headers: this.auth.headers,
            }
        );
    }
}
