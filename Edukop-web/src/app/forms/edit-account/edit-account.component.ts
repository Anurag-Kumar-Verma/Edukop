import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { NavigationExtras, Router } from "@angular/router";
import {
  CountryISO,
  PhoneNumberFormat,
  SearchCountryField,
} from "ngx-intl-tel-input";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { IUser } from "src/app/model/IUser.model";
import { UserInfoFormService } from "src/app/services/userInfoService.service";
import { SharedService } from "src/app/shared/services/shared.service";
import { UserStateService } from "src/app/shared/states/user-info.state";
import { environment } from "src/environments/environment";
import { RequestProductComponent } from "../request-product/request-product.component";

@Component({
  selector: "app-edit-account",
  templateUrl: "./edit-account.component.html",
  styleUrls: ["./edit-account.component.scss"],
})
export class EditAccountComponent implements OnInit {
  userInfoForm!: FormGroup;
  isPasswordMatch: boolean = true;
  showPassword: boolean = false;
  showPassword2: boolean = false;

  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  formData!: FormData;
  userData!: IUser;
  imgLoaded: boolean = false;
  emailDisabled: boolean = false;
  imageUrl: string = "";
  imagePath: string = '';
  imageApi = environment.imageApi;
  upload: boolean = false;

  constructor(
    private fb: FormBuilder,
    public router: Router,
    public dialogCtrl: MatDialog,
    private spinner: NgxSpinnerService,
    public sharedService: SharedService,
    public userStateService: UserStateService,
    public userInfoService: UserInfoFormService,
    public toaster: ToastrService
  ) {}

  ngOnInit(): void {
    this.getUserState();
    this.userInfoFormGroup();
  }

  getUserState(): void {
    this.userStateService.getUserState().subscribe((val) => {
      this.getUserInfo();
    });
  }

  getUserInfo(): void {
    this.spinner.show();
    this.sharedService.getUserInfo().subscribe(
      (response) => {
        this.userData = response.DATA as IUser;
        this.patchValue();
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  userInfoFormGroup(): void {
    this.userInfoForm = this.fb.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      email: [""],
      phoneNo: [
        "",
        [Validators.required, Validators.pattern("^[6-9][0-9]{9}$")],
      ],
      // dateOfBirth: ["", Validators.required],
      city: ["", Validators.required],
      //   country: ["", Validators.required],
    });
  }

  patchValue(): void {
    this.imgLoaded = true;
    if (this.userData.imageUrl) {
      this.imageUrl = environment.thumbApi + this.userData.imageUrl;
    }
    this.userInfoForm.patchValue({
      firstName: this.userData.firstName,
      lastName: this.userData.lastName,
      email: this.userData.email,
      phoneNo: this.userData.phoneNo,
      city: this.userData.city,
    });
    if (
      this.userInfoForm.controls["email"].value !== undefined ||
      !this.userData.email
    ) {
      this.emailDisabled == true;
    }
  }

  uploadProfileImage(files: Event): void {
    var fileToUpload = (files.target as any).files[0];
    this.formData = new FormData();
    if (fileToUpload) {
      if (
        fileToUpload &&
        !(
          fileToUpload.type === "image/jpeg" ||
          fileToUpload.type === "image/png"
        )
      ) {
        alert("Unsupported file format.Only JPG, PNG files are allowed");
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(fileToUpload);

      reader.onload = (events: any) => {
        this.imagePath = events.target.result;
        this.upload = true;
      };
      this.uploadMedia(fileToUpload);
    }
  }

  uploadMedia(fileToUpload: any) {
    this.spinner.show();
    this.sharedService.uploadProfileImage(fileToUpload).subscribe(
      (response: any) => {
        this.userStateService.updateState(response.DATA);
        this.spinner.hide();
      },
      (error) => {
        console.log(error);
        this.spinner.hide();
      }
    );
  }
  cancel() {
    history.back();
  }
  
  submit() {
    this.spinner.show();

    this.userInfoService.userInfo(this.userInfoForm.value).subscribe((res) => {
      if (res) {
        this.toaster.success("Account Updated");
        this.router.navigateByUrl("/side/my-account").catch();
        this.spinner.hide();
      }
    }, (error) => {
      this.spinner.hide();
    });
  }

}
