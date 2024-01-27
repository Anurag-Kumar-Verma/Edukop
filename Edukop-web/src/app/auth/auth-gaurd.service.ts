import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from "@angular/router";

import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate():boolean{
    const currentUser = this.auth.getToken();
    if (currentUser) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
