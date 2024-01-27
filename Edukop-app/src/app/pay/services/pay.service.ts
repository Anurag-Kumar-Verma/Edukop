import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as interfaces from '@spundan-clients/bookz-interfaces';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';

import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class PayService {
    headers: HttpHeaders;
    constructor(public http: HttpClient, public authService: AuthService) {
        this.headers = new HttpHeaders({
            'Content-Type':
                'text/plain, application/json ,Access-Control-Request-Method, Access-Control-Request-Headers',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Headers': 'Origin Accept',
            'Access-Control-Allow-Methods':
                'GET, POST, DELETE, PUT, HEAD, OPTIONS',
            Authorization:
                'Basic cnpwX3Rlc3RfV2Jic3RhSFdSdVR0RVI6d1pMbEREVVVueHZ3M1JpMW5QVkJlOEJT',
        });
    }

    createOrder(
        params: interfaces.IOrder
    ): Observable<interfaces.IResponseGet<interfaces.IRazorpay>> {
        return this.http.post<interfaces.IResponseGet<interfaces.IRazorpay>>(
            environment.Api + '/api/razor/order',
            params,
            {
                headers: this.authService.headers,
            }
        );
    }

    capturePayment(
        params: interfaces.ICaptureRazorPayPayment
    ): Observable<interfaces.IResponseGet<interfaces.IOrder>> {
        return this.http.post<interfaces.IResponseGet<interfaces.IOrder>>(
            environment.Api + '/api/razor/capturePayment',
            params,
            {
                headers: this.authService.headers,
            }
        );
    }

    //   createOrder(params: any): Observable<any> {
    //     return this.http.post("https://api.razorpay.com/v1/orders", params, {
    //       headers: this.headers,
    //     });
    //   }
}
