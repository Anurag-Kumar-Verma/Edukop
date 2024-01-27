import { Component, HostListener, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { IUser } from "src/app/model/IUser.model";
import { SharedService } from "src/app/shared/services/shared.service";
import { UserStateService } from "src/app/shared/states/user-info.state";
import { environment } from "src/environments/environment";

export interface ModalData {
  action: string;
}

@Component({
  selector: "app-request-product",
  templateUrl: "./request-product.component.html",
  styleUrls: ["./request-product.component.scss"],
})
export class RequestProductComponent implements OnInit {
  RequestProductForm!: FormGroup;
  formData!: FormData;
  FileimageUrl: string | ArrayBuffer = "";
  upload: boolean = false;
  imageUrl: any;
  name: string = "";
  desc: string = "";
  productUUID: string | undefined;
  imagePath!: string;

  error: string = "";
  dragAreaClass: string = "";
  draggedFiles: any;

  isGuest!: boolean;
  userState!: Subscription;
  userInfo!: IUser;

  constructor(
    public router: Router,
    private fb: FormBuilder,
    public sharedService: SharedService,
    public toaster: ToastrService,
    private spinner: NgxSpinnerService,
    public userStateService: UserStateService,
    public authService: AuthService,
    private dialogRef: MatDialogRef<RequestProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalData
  ) {}

  ngOnInit(): void {
    this.getUserState();
  }
  getUserState(): void {
    this.userState = this.userStateService.getUserState().subscribe((val) => {
      this.getUserInfo();
      this.isGuest = this.authService.currentGuestUserValue;
    });
  }

  getUserInfo(): void {
    this.sharedService.getUserInfo().subscribe((response) => {
      this.userInfo = response.DATA as IUser;
      this.RequestProduct();
      console.log(this.userInfo);
    });
  }

  RequestProduct(): void {
    this.RequestProductForm = this.fb.group({
      name: ["", Validators.required],
      Description: [""],
      imageUrl: ["", Validators.required],
      userId: this.userInfo.uuid,
    });
  }

  onFileChange(event: Event) {
    let files: FileList = (event.target as any).files[0];;
    this.uploadImage(files as any);
  }

  @HostListener("dragover", ["$event"]) onDragOver(event: any) {
    this.dragAreaClass = "droparea";
    event.preventDefault();
  }
  @HostListener("dragenter", ["$event"]) onDragEnter(event: any) {
    this.dragAreaClass = "droparea";
    event.preventDefault();
  }
  @HostListener("dragend", ["$event"]) onDragEnd(event: any) {
    this.dragAreaClass = "dragarea";
    event.preventDefault();
  }
  @HostListener("dragleave", ["$event"]) onDragLeave(event: any) {
    this.dragAreaClass = "dragarea";
    event.preventDefault();
  }
  @HostListener("drop", ["$event"]) onDrop(event: any) {
    console.log(event);
    this.dragAreaClass = "dragarea";
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files) {
      let files: FileList = event.dataTransfer.files;
      this.uploadImage(files as any);
    }
  }

  deleteImage() {
    this.upload = false;
    this.draggedFiles = "";
    confirm("Delete Image");
  }

  // uploadImage(event: FileList): void {
  //   const fileToUpload = event[0];
  //   this.formData = new FormData();
  //   if (event && event[0]) {
  //     if (
  //       fileToUpload &&
  //       !(
  //         fileToUpload.type === "image/jpeg" ||
  //         fileToUpload.type === "image/png"
  //       )
  //     ) {
  //       alert("Unsupported file format.Only JPG, PNG files are allowed");
  //       return;
  //     }
  //     const reader = new FileReader();
  //     const file = event[0];
  //     this.formData.append("imagePath", file);
  //     reader.readAsDataURL(event[0]);
  //     reader.onload = (events) => {
  //       this.imagePath = <string>reader.result;
  //       this.upload = true;
  //     };

  //     this.FileimageUrl = event[0].name;

  //     this.RequestProductForm.patchValue({
  //       imageUrl: environment.imageApi + "/request/" + this.productUUID + "/" + event[0].name
  //     });
  //   }
  // }

  close() {
    this.dialogRef.close();
  }

  uploadImage(files: Event): void {
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
      this.FileimageUrl = fileToUpload;
    console.log(this.FileimageUrl);

      reader.onload = (events: any) => {
        this.imagePath = events.target.result;
        this.upload = true;
      };
      // this.uploadMedia(fileToUpload);
    }
  }

  uploadMedia(fileToUpload: any): void {
    this.sharedService
      .uploadProductImage(fileToUpload, this.productUUID as string)
      .subscribe(
        (response: any) => {
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  submit() {
    const request = {
      name: this.name,
      Description: this.desc,
      uuid: this.productUUID,
      userId: this.userInfo.uuid,
    };
    console.log(request);
    this.spinner.show();
    this.sharedService.addRequest(request).subscribe(
      (res) => {
        if (res) {
          if (res.DATA) {
            this.toaster.success("Product Request Submitted");
          }
          this.productUUID = res.DATA.uuid;
          this.sharedService
            .uploadProductImage(this.FileimageUrl as any, this.productUUID)
            .subscribe((res: any) => {
              console.log(res);
            });
          this.spinner.hide();
          this.dialogRef.close("submit");
        }
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }
}
