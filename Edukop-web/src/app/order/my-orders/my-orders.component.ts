import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { IOrder } from 'src/app/model/IOrder.model';
import { IUser } from 'src/app/model/IUser.model';
import { OrderSummaryService } from 'src/app/services/orderSummaryService.service';
import { UserStateService } from 'src/app/shared/states/user-info.state';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss']
})
export class MyOrdersComponent implements OnInit {
  userInfo!: IUser;
  orderList: IOrder[] = [];
  imageUrl: string = environment.thumbApi;

  constructor(
    public router: Router,
    public userStateService: UserStateService,
    public orderService: OrderSummaryService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.getUserState();
    this.getOrder();
  }

  getUserState(): void {
    this.userStateService.getUserState().subscribe((val) => {
    });
  }

  getOrder() {
    this.orderService.getOrder().subscribe(res => {
      if(res.DATA.length > 0) {
        for(let i = 0; i < res.DATA.length; i++) {
          this.orderList.push(res.DATA[i]);
        }
      }
    })
  }

  orderDetail(orderId: string) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        orderId: JSON.stringify(orderId)
      }
    };

    this.router.navigate([`/side/order-detail`], navigationExtras)
  }

}
