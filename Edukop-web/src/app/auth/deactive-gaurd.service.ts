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
            return true;
        } else {
            this.router.navigate(['/dashboard']);
            return false;
        }
    }
}
