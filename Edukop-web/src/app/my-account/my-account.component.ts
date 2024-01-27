import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { NavigationExtras, Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { RequestProductComponent } from "../forms/request-product/request-product.component";
import { IUser } from "../model/IUser.model";
import { AddressService } from "../services/address.service";
import { SharedService } from "../shared/services/shared.service";
import { UserStateService } from "../shared/states/user-info.state";
import * as interfaces from "@spundan-clients/bookz-interfaces";
import { Address, IAddressList } from "../model/IAddress.model";
import { ToastrService } from "ngx-toastr";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-my-account",
  templateUrl: "./my-account.component.html",
  styleUrls: ["./my-account.component.scss"],
})
export class MyAccountComponent implements OnInit {
  userInfo!: IUser;
  myAddressess!: Address;
  allAddresses: Address[] = [];
  isAddressView: boolean = false;
  upload: boolean = false;
  imageApi = environment.imageApi;
  imagePath: string = "";
  formData!: FormData;

  constructor(
    public router: Router,
    public dialogCtrl: MatDialog,
    private spinner: NgxSpinnerService,
    public userStateService: UserStateService,
    public sharedService: SharedService,
    public addressService: AddressService,
    public toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getUserState();
  }

  getUserState(): void {
    this.userStateService.getUserState().subscribe((val) => {
      this.getUserInfo();
      this.getAddress();
      this.getAllAddresses();
    });
  }

  getUserInfo(): void {
    this.spinner.show();
    this.sharedService.getUserInfo().subscribe(
      (response) => {
        this.userInfo = response.DATA as IUser;
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  getAddress(): void {
    this.spinner.show();
    this.addressService.getDefaultAddress().subscribe(
      (res) => {
        this.myAddressess = res.DATA as Address;
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  getAllAddresses() {
    this.spinner.show();
    this.allAddresses = [];
    this.addressService.getAddress().subscribe(
      (res) => {
        if (res.DATA) {
          for (let i in res.DATA) {
            this.allAddresses.push(res.DATA[i]);
          }
          this.spinner.hide();
        }
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  viewAddress() {
    this.isAddressView = !this.isAddressView;
  }

  requestProduct() {
    const addProduct = this.dialogCtrl.open(RequestProductComponent, {
      panelClass: "RequestProduct",
      data: { action: "add" },
    });

    addProduct.afterClosed().subscribe((result) => {
      this.router.navigate([`/dashboard`]);
    });
  }

  editAddress(addressId: string) {
    let navigationExtra: NavigationExtras = {
      queryParams: {
        action: JSON.stringify("Update"),
        id: JSON.stringify(addressId),
      },
    };
    this.router.navigate([`/side/add-address`], navigationExtra);
  }

  addAddress() {
    let navigationExtra: NavigationExtras = {
      queryParams: {
        action: JSON.stringify("add"),
        id: JSON.stringify(null),
      },
    };
    this.router.navigate([`/side/add-address`], navigationExtra);
  }

  removeAddress(uuid: string, index: number) {
    this.spinner.show();
    this.addressService.deleteAddress(uuid).subscribe(
      (res) => {
        this.allAddresses.splice(index, 1);
        this.getAddress();
        this.toastr.success("Address Removed");
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }
  setDefault(uuid: string) {
    this.addressService.selectDefaultAddress(uuid).subscribe((res) => {
      if (res.DATA) {
        this.getAddress();
        this.getAllAddresses();
      }
    });
  }
}
