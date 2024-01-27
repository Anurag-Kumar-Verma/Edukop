import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { CountryISO, PhoneNumberFormat, SearchCountryField } from "ngx-intl-tel-input";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { map, Observable, startWith } from "rxjs";
import { AddressService } from "src/app/services/address.service";
import * as interfaces from "@spundan-clients/bookz-interfaces";
import { SharedService } from "src/app/shared/services/shared.service";
import { MatSelectChange } from "@angular/material/select";

@Component({
  selector: "app-add-aaddress",
  templateUrl: "./add-aaddress.component.html",
  styleUrls: ["./add-aaddress.component.scss"],
})
export class AddAaddressComponent implements OnInit {
  addressFormGroup!: FormGroup;
  cities: interfaces.ICityAndState[] = [];
  states: any[] = [];

  formTitle: string = '';
  buttonText: string = '';

  addressId: string = '';
  action: string = '';
  searchString: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    public addressService: AddressService,
    public sharedService: SharedService,
    public toaster: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(paramas => {
      if(paramas) {
        this.action = JSON.parse(paramas?.["action"]);
        this.addressId = JSON.parse(paramas?.["id"]);
      }
    })
    this.addressForm();
    this.getStates();
    if(this.action == "Update"){
      this.formTitle = "Update Address";
      this.buttonText = "Update";
      this.getAddressById(this.addressId);
    } else {
      this.formTitle = "Add New Address";
      this.buttonText = "Submit";
    }
  }

  getStates(): void {
    this.sharedService.getStates().subscribe(response => {
      this.states = response;
    });
  }

  findState(stateName: string): string {
    const ab = this.states.find(e1 => e1.name === stateName);
    return ab ? ab.isoCode : '';
  }

  setState(event: MatSelectChange) {
    let code = this.findState(event.value);
    this.spinner.show();
    this.sharedService.getCities(code).subscribe(response => {
      this.cities = response;
      this.spinner.hide();
    });
  }

  // setCity(event: MatSelectChange) {
  //   this.addressFormGroup.patchValue({
  //     city: event.value
  //   });
  // }

  search(event: any) {
    event.stopPropagation();
    this.searchString = event.target?.value
  }


  getAddressById(uuid: string) {
    this.addressService.getAddressById(uuid).subscribe(res => {
      this.addressFormGroup.addControl('uuid', new FormControl() );
      this.addressFormGroup.patchValue(res.DATA);
      const event: MatSelectChange = {
        source: {} as any,
        value: res.DATA.state
      }
      this.setState(event);
    });
  }


  addressForm(): void {
    this.addressFormGroup = this.fb.group({
      fullName: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[a-zA-Z ]+$"),
        ]),
      ],
      phone: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[6-9][0-9]{9}$"),
          Validators.minLength(10),
          Validators.maxLength(10),
        ]),
      ],
      pincode: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[0-9]{6}$"),
        ]),
      ],
      address: ["", Validators.required],
      city: ["", Validators.required],
      state: ["", Validators.required],
      landmark: ["", Validators.required],
    });
  }

  cancel() {
    this.addressFormGroup.reset();
    history.back();
  }

  submit() {
    this.action == 'Update' ? this.updateAddress() : this.addAddress();
  }

  addAddress() {
    if(this.addressFormGroup.invalid) {
      return;
    } else {
      this.spinner.show();
      this.addressService.addAddress(this.addressFormGroup.value).subscribe(res => {
        if(res.DATA) {
          this.toaster.success("New address added");
          history.back();
          this.spinner.hide();
        }
      }, (error) => {
        this.spinner.hide();
      });
    }
  }

  updateAddress() {
    if(!this.addressFormGroup.invalid) {
      this.spinner.show();
      this.addressService.updateAddress(this.addressFormGroup.value).subscribe(res => {
        if(res) {
          this.toaster.success("Address updated successfully");
          history.back();
          this.spinner.hide();
        }
      }, (error) => {
        this.spinner.hide();
      });
    } else {
      return;
    }
  }

}
