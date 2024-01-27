import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as interfaces from '@spundan-clients/bookz-interfaces';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
    providedIn: 'root',
})
export class CartService {
    constructor(private http: HttpClient, public auth: AuthService) {}

    addCart(
        params: object
    ): Observable<interfaces.IResponseGet<interfaces.ICart>> {
        return this.http.post<interfaces.IResponseGet<interfaces.ICart>>(
            environment.Api + `/api/cart`,
            params,
            {
                headers: this.auth.headers,
            }
        );
    }

    updateCart(
        params: interfaces.ICart
    ): Observable<interfaces.IResponseGet<interfaces.ICart>> {
        return this.http.put<interfaces.IResponseGet<interfaces.ICart>>(
            environment.Api + `/api/cart`,
            params,
            {
                headers: this.auth.headers,
            }
        );
    }

    getCartById(
        cartUUID: string
    ): Observable<interfaces.IResponseGet<interfaces.ICart>> {
        return this.http.get<interfaces.IResponseGet<interfaces.ICart>>(
            environment.Api + `/api/cart?uuid=${cartUUID}`,
            {
                headers: this.auth.headers,
            }
        );
    }

    getCart(): Observable<interfaces.IResponseGet<interfaces.ICart>> {
        return this.http.get<interfaces.IResponseGet<interfaces.ICart>>(
            environment.Api + `/api/cart`,
            {
                headers: this.auth.headers,
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

    paymentOrder(
        orderUUID: string
    ): Observable<interfaces.IResponseGet<interfaces.IOrder>> {
        return this.http.post<interfaces.IResponseGet<interfaces.IOrder>>(
            environment.Api + `/api/payment?uuid=${orderUUID}`,
            {
                headers: this.auth.headers,
            }
        );
    }

    removeCartProduct(
        productUUID: string
    ): Observable<interfaces.IResponseGet<interfaces.ICart>> {
        return this.http.delete<interfaces.IResponseGet<interfaces.ICart>>(
            environment.Api + `/api/delete?productUUID=${productUUID}`,
            {
                headers: this.auth.headers,
            }
        );
    }

    applyCoupon(couponData: Object, code: string): Observable<any> {
        return this.http.post<any>(
            environment.Api + `/api/rules?code=${code}`,
            couponData,
            {
                headers: this.auth.headers,
            }
        );
    }

    removeCoupon(
        cartUUID: string
    ): Observable<interfaces.IResponseGet<interfaces.IOrder>> {
        // console.log(this.auth.currentUserValue)
        return this.http.get<interfaces.IResponseGet<interfaces.IOrder>>(
            environment.Api + `/api/removeCoupon?cartUUID=${cartUUID}`,
            {
                headers: {
                    authtoken: this.auth.currentUserValue,
                },
            }
        );
    }
}
