import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as interfaces from '@spundan-clients/bookz-interfaces';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/internal/operators/catchError';
import { map } from 'rxjs/internal/operators/map';

import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/services/auth.service';
import { Wishlist } from '../model/wishList.model';

@Injectable({
    providedIn: 'root',
})
export class WishlistService {
    constructor(public http: HttpClient, public auth: AuthService) {}

    getWishList(): Observable<interfaces.IResponseGet<Wishlist>> {
        return this.http.get<interfaces.IResponseGet<Wishlist>>(
            environment.Api + `/api/userWishlists`,
            {
                headers: this.auth.headers,
            }
        );
    }

    removeWishList(
        productUUID: string
    ): Observable<interfaces.IResponseGet<interfaces.IUser>> {
        return this.http.delete<interfaces.IResponseGet<interfaces.IUser>>(
            environment.Api + `/api/cart?productUUID=${productUUID}`,
            {
                headers: this.auth.headers,
            }
        );
    }

    addWishList(
        params: interfaces.IWishlist
    ): Observable<interfaces.IResponseGet<interfaces.IWishlist>> {
        return this.http.post<interfaces.IResponseGet<interfaces.IWishlist>>(
            environment.Api + `/api/wishlist`,
            params,
            {
                headers: this.auth.headers,
            }
        );
    }
}
