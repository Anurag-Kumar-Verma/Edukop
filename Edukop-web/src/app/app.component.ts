import { Location, LocationStrategy, PlatformLocation } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, NavigationExtras, NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'edukop-web';
  isActiveHeader: boolean = true;
  isActiveSidebar: boolean = true;
  activeRoute: string = '';

  constructor(
    private router: Router
  ) {
    this.router.events.subscribe(event => {
      if(event instanceof NavigationStart) {
        this.activeRoute = event.url.split('?')[0];
        this.activeRoute = event.url.split('#')[0];
      }
    });
  }

  ngOnInit() {
    if(this.activeRoute != '/login' && this.activeRoute != '/signup') {
      this.isActiveHeader = true;
    } else {
      this.isActiveHeader = false;
    }
  }

  editProfile() {
    let navigationExtras: NavigationExtras = {
      queryParams : {
        action: JSON.stringify("edit")
      }
    };

    this.router.navigate([`/edit-account`]);
  }

  myAccount() {
    let navigationExtras: NavigationExtras = {
      queryParams : {
        action: JSON.stringify(null)
      }
    };

    this.router.navigate([`/my-account`]);
  }
}
