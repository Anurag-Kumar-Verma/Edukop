import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationExtras, NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RequestProductComponent } from '../forms/request-product/request-product.component';
import * as interfaces from "@spundan-clients/bookz-interfaces";
import { AuthService } from '../auth/auth.service';
import { UserStateService } from '../shared/states/user-info.state';
import { SharedService } from '../shared/services/shared.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})
export class ContainerComponent implements OnInit {
  isMobile: boolean = false;
  showMenu: boolean = true;
  activeRout: string = '';
  isGuest!: boolean;
  userState!: Subscription;
  userInfo!: interfaces.IUser;
  activeRoute: string = '';
  imageApi = environment.imageApi;
  isOnline: string = '';
  

  constructor(
    public router: Router,
    public dialogCtrl: MatDialog,
    private authService: AuthService,
    public userStateService: UserStateService,
    public sharedService: SharedService,

  ) {
    this.userStateService.getUserState().subscribe((val) => {
      console.log(val)
      this.sharedService.getUserInfo().subscribe((response) => {
        this.userInfo = response.DATA;
      });
      this.isGuest = this.authService.currentGuestUserValue;
    });

    this.router.events.subscribe(event => {
      if(event instanceof NavigationStart) {
        this.activeRoute = event.url.split('?')[0];
      }
    });
  }

  ngOnInit(): void {
    this.activeRoute = this.router.url;
    this.activeRout = this.router.url.split("?")[0];
    this.checkWindowSize();

    window.addEventListener("resize", (event) => {
      this.checkWindowSize();
    });
    
    // setInterval(this.updateOnlineStatus, 100000)
    this.updateOnlineStatus();

  }

  updateOnlineStatus() {
    this.isOnline = navigator.onLine ? "online" : "offline";
    console.log(this.isOnline);
  }


  checkWindowSize() {
    if(window.innerWidth < 768) {
      this.isMobile = true;
      this.showMenu = false;
    } else {
      this.isMobile = false;
      this.showMenu = true;
    }
  }

  toggleOpen() {
    this.isMobile = true;
  }
  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  toggleClose(event: any) {
    event.stopPropagation();
    this.isMobile = false;
    this.showMenu = false;
  }


  
  cancel() {
    history.back();
  }

  editProfile(event: any) {
    event.stopPropagation();
    let navigationExtras: NavigationExtras = {
      queryParams : {
        action: JSON.stringify("edit")
      }
    };

    this.router.navigate([`/side/edit-account`]);
  }

  myAccount() {
    let navigationExtras: NavigationExtras = {
      queryParams : {
        action: JSON.stringify(null)
      }
    };

    this.router.navigate([`/side/my-account`]);
  }

  wishlist() {
    this.router.navigate([`/side/wishlist`]);
  }

  myOrders() {
    this.router.navigate([`/side/my-orders`]);
  }

  cart() {
    this.router.navigate([`/my-cart`]);
  }

  categories() {
    this.router.navigate([`/side/categories`]);
  }

  newsFeed() {
    this.router.navigate([`/side/newsfeeds`]);
  }

  contact() {
    this.router.navigate([`/side/support`]);
  }

  requestProduct() {
    const addProduct = this.dialogCtrl.open(RequestProductComponent, {
      panelClass: "RequestProduct",
      maxWidth: "90vw",
      data: {action: "add"}
    });

    // addProduct.afterClosed().subscribe(result => {
    //   if(result === 'submit') {

    //   }
    // });
  }

  logout() {
    this.userStateService.updateState(null as any);
    this.authService.logout();
  }
  login() {
    this.router.navigate([`/login`]);
  }

}
