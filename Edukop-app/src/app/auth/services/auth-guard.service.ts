import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    CanDeactivate,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(private auth: AuthService, private router: Router) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        const currentUser = this.auth.currentUserValue;
        if (currentUser !== undefined && currentUser !== null) {
            // authorised so return true
            return true;
        }

        // not logged in so redirect to login page with the return url
        // this.router.navigate(['/login']);
        return false;
    }
}
