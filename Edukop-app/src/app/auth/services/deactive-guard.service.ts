import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    CanDeactivate,
    Router,
    RouterStateSnapshot,
} from '@angular/router';

import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root',
})
export class DeactiveAuthGuard implements CanActivate {
    constructor(private auth: AuthService, private router: Router) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        const currentUser = this.auth.currentGuestUserValue;
        if (currentUser) {
            // authorised so return true
            return true;
        }
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/tab/dashboard']);
        //return false;
    }
}
