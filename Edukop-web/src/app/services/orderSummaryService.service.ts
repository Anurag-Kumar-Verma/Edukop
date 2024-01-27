import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as interfaces from '@spundan-clients/bookz-interfaces';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { IOrder } from '../model/IOrder.model';

@Injectable({
    providedIn: 'root',
})
export class OrderSummaryService {
    constructor(private http: HttpClient, public auth: AuthService) {}

    getOrderById(
        orderUUID: string
    ): Observable<interfaces.IResponseGet<IOrder>> {
        return this.http.get<interfaces.IResponseGet<IOrder>>(
            environment.Api + `/api/orderOne?uuid=${orderUUID}`,
            {
                headers: this.auth.headers,
            }
        );
    }

    getOrder(): Observable<interfaces.IResponseGet<IOrder[]>> {
        return this.http.get<interfaces.IResponseGet<IOrder[]>>(
            environment.Api + `/api/order`,
            {
                headers: this.auth.headers,
            }
        );
    }

    removeCoupon(
        orderUUID: string
    ): Observable<interfaces.IResponseGet<interfaces.IOrder>> {
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

    downloadInvoice(id: string, vendorId: string): Observable<any> {
        return this.http.get(
            environment.Api + `/api/invoiceGenerate?uuid=${id}&vendorId=${vendorId}`,
            {
                responseType: "blob",
                headers: this.auth.headers,
            }
        );
    }

    requestReturn(
        params: object
    ): Observable<interfaces.IResponseGet<interfaces.IReturn>> {
        return this.http.post<interfaces.IResponseGet<interfaces.IReturn>>(
            environment.Api + `/api/return-order`,
            params,
            {
                headers: this.auth.headers,
            }
        );
    }

    requestCancel(
        params: object
    ): Observable<interfaces.IResponseGet<interfaces.IReturn>> {
        return this.http.post<interfaces.IResponseGet<interfaces.IReturn>>(
            environment.Api + `/api/cancel-order`,
            params,
            {
                headers: this.auth.headers,
            }
        );
    }
}
