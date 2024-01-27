import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { ToastService } from 'src/app/shared/services/toast.service';

import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root',
})
export class GuestAuthGuard implements CanActivate {
    constructor(
        private auth: AuthService,
        private router: Router,
        public toastService: ToastService
    ) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        const guestRoute = localStorage.getItem('guest-route');
        // localStorage.setItem('last-route', state.url);
        // this.toastService.showToast('Please login first', 'end');
        if (guestRoute !== undefined && guestRoute !== null) {
            localStorage.setItem('last-route', guestRoute);
        } else {
            localStorage.setItem('last-route', state.url);
        }
        // const guestRoute1 = localStorage.getItem('last-route');
        //localStorage.setItem('last-route', state.url);

        const currentUser = this.auth.currentGuestUserValue;
        if (currentUser === undefined) {
            return true;
        }
        this.router.navigate(['/tab/login']).catch();
        return false;
    }
}
