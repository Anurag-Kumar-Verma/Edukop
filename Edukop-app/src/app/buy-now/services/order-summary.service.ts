import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as interfaces from '@spundan-clients/bookz-interfaces';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/internal/operators/catchError';
import { map } from 'rxjs/internal/operators/map';

import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
    providedIn: 'root',
})
export class OrderSummaryService {
    constructor(private http: HttpClient, public auth: AuthService) {}

    getOrderById(
        orderUUID: string
    ): Observable<interfaces.IResponseGet<interfaces.IOrder>> {
        return this.http.get<interfaces.IResponseGet<interfaces.IOrder>>(
            environment.Api + `/api/orderOne?uuid=${orderUUID}`,
            {
                headers: this.auth.headers,
            }
        );
    }

    getOrder(): Observable<interfaces.IResponseGet<interfaces.IOrder[]>> {
        return this.http.get<interfaces.IResponseGet<interfaces.IOrder[]>>(
            environment.Api + `/api/order`,
            {
                headers: this.auth.headers,
            }
        );
    }

    removeCoupon(
        orderUUID: string
    ): Observable<interfaces.IResponseGet<interfaces.IOrder>> {
        // console.log(this.auth.currentUserValue)
        return this.http.get<interfaces.IResponseGet<interfaces.IOrder>>(
            environment.Api + `/api/removeCoupon?uuid=${orderUUID}`,
            {
                headers: {
                    authtoken: this.auth.currentUserValue,
                },
            }
        );
    }

    placeOrder(
        params: interfaces.IOrder
    ): Observable<interfaces.IResponseGet<interfaces.IOrder>> {
        return this.http.post<interfaces.IResponseGet<interfaces.IOrder>>(
            environment.Api + `/api/order`,
            params,
            {
                headers: this.auth.headers,
            }
        );
    }

    addAddressOnOrder(
        params: interfaces.IOrder,
        isAddress: boolean
    ): Observable<interfaces.IResponseGet<interfaces.IOrder>> {
        return this.http.put<interfaces.IResponseGet<interfaces.IOrder>>(
            environment.Api + `/api/order?isAddress=${isAddress}`,
            params,
            {
                headers: this.auth.headers,
            }
        );
    }
}
