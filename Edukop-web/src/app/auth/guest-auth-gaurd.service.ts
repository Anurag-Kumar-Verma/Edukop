import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { ToastrService } from "ngx-toastr";

import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})

export class GuestAuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
    public toastService: ToastrService
  ) {}

  canActivate(): boolean {
    const currentUser = this.auth.currentGuestUserValue;
    if (!currentUser) {
      return true;
    }
    this.router.navigate(["/login"]).catch();
    return false;
  }
}
