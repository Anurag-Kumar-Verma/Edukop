import { HttpClient } from '@angular/common/http';
import { Component, NgZone, OnInit } from '@angular/core';
import {
    FileTransfer,
    FileUploadOptions,
    FileTransferObject,
} from '@ionic-native/file-transfer/ngx';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
     CameraResultType, Camera, CameraSource,
} from '@capacitor/camera';
import {
    ActionSheetController,
    LoadingController,
    NavController,
} from '@ionic/angular';
import * as interfaces from '@spundan-clients/bookz-interfaces';
import { environment } from 'src/environments/environment';
import { File } from '@ionic-native/file/ngx';

import { LoaderService } from '../shared/loader/loader.service';
import { SharedService } from '../shared/services/shared.service';
import { ToastService } from '../shared/services/toast.service';
import { UserStateService } from '../shared/state/user-info.state';

import { UserInfoFormService } from './services/user-info-form.service';
import { RouteService } from '../shared/services/router.service';
import { AuthService } from '../auth/services/auth.service';
import { Capacitor } from '@capacitor/core';

@Component({
    selector: 'app-user-info',
    templateUrl: './user-info.page.html',
    styleUrls: ['./user-info.page.scss'],
})
export class UserInfoPage implements OnInit {
    userInfoForm: FormGroup;
    userData: interfaces.IUser;
    imageUrl: string;
    imgLoaded: boolean = false;
    inputDisabled: boolean = false;

    constructor(
        public router: Router,
        private authService: AuthService,
        private fb: FormBuilder,
        private userInfoService: UserInfoFormService,
        public sharedService: SharedService,
        public http: HttpClient,
        public actionSheetController: ActionSheetController,
        public toast: ToastService,
        private ngZone: NgZone,
        public loaderService: LoaderService,
        private userStateService: UserStateService,
        private cordovaFile: File,
        private transfer: FileTransfer,
        public routeService: RouteService
    ) { }

    ngOnInit(): void {
        this.loaderService.display(false);
        this.userInfoFormGroup();
        this.getUserState();
    }

    getUserState(): void {
        this.userStateService.getUserState().subscribe(val => {
            this.getUserInfo();
        });
    }

    userInfoFormGroup(): void {
        this.userInfoForm = this.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', Validators.compose([Validators.required, Validators.email])],
            phoneNo: ['', Validators.compose([Validators.required, Validators.pattern("^[6-9][0-9]{9}$")])],
            // dateOfBirth: ["", Validators.required],
            city: ['', Validators.required],
            //   country: ["", Validators.required],
        });
    }

    private getUserInfo(): void {
        this.sharedService.getUserInfo().subscribe(res => {
            this.userData = res.DATA;
            this.patchValue();
        });
    }

    patchValue(): void {
        this.imgLoaded = true;
        if (this.userData.imageUrl?.length > 0) {
            this.imageUrl = environment.thumbApi + this.userData.imageUrl;
        }
        this.userInfoForm.patchValue({
            firstName: this.userData.firstName,
            lastName: this.userData.lastName,
            email: this.userData.email,
            phoneNo: this.userData.phoneNo,
            // dateOfBirth: ["", Validators.required],
            city: this.userData.city,
        });
        if(this.userInfoForm.controls.email.value !== undefined){
            this.inputDisabled == true;
        }
    }

    async selectImage(): Promise<void> {
        const actionSheet = await this.actionSheetController.create({
            header: 'Pick your profile photo',
            buttons: [
                {
                    text: 'From Gallery',
                    handler: () => {
                        this.takePicture('gallery');
                    },
                },
                {
                    text: 'From Camera',
                    handler: () => {
                        this.takePicture('camera');
                    },
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                },
            ],
        });
        await actionSheet.present();
    }

    b64toBlob(b64Data, contentType) {
        contentType = contentType || '';
        var sliceSize = 512;
        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        var blob = new Blob(byteArrays, { type: contentType });
        return blob;
    }

    takePicture(action): void {
        if (!this.imgLoaded) {
            return;
        }
        let options = {
            quality: 100,
            resultType: CameraResultType.Uri,
            source: CameraSource.Prompt
        };
        Camera.getPhoto(options).then(
            imagePath => {
                let data12 = Capacitor.convertFileSrc(imagePath.path);
                this.uploadUserImage(imagePath.path);
                // let filePath: string;
                // if (action === 'camera') {
                //     let blob = this.b64toBlob(imagePath.path, 'image/jpeg');
                //     console.log(blob,'blob');
                //     console.log(this.cordovaFile)
                //     this.cordovaFile.checkFile(this.cordovaFile.externalApplicationStorageDirectory +
                //         'files/', 'image').then(files => {
                //             if (files) {
                //                 console.log(files,'files')
                //                 this.cordovaFile.removeFile(this.cordovaFile.externalApplicationStorageDirectory +
                //                     'files/', 'image').then(a => {
                //                         console.log(a,'a')
                //                         this.saveFile(blob).then(a => {
                //                             console.log(a,'aaaa')
                //                             filePath = a;
                //                             console.log(filePath,'filepath')
                //                             this.uploadUserImage(filePath);
                //                         });
                //                     })
                //             }
                //         }).catch(err => {
                //             console.log(err,'errrrrr')
                //             this.saveFile(blob).then(a => {
                //                 filePath = a;
                //                 this.uploadUserImage(filePath);
                //             });

                //         })
                // } 
                // else {
                //     filePath = imagePath.path;
                //     this.uploadUserImage(filePath);
                // }
            },
            error => {
                console.log(error,"error")
                this.toast.showToast(error, 'end').catch();
            }
        );
    }

    private uploadUserImage(filePath: string) {
        let options1: FileUploadOptions = {
            fileKey: 'imagePath',
            fileName: 'imagePath',
            headers: {
                authtoken: this.authService.currentUserValue,
            },
            params: { imagePath: 'imagePath' },
            chunkedMode: false,
        };

        const fileTransfer: FileTransferObject = this.transfer.create();
        this.imgLoaded = false;

        fileTransfer
            .upload(filePath, environment.Api + `/userImage`, options1)
            .then(res => {
                let response = JSON.parse(res.response);
                this.imageUrl =
                    environment.thumbApi + response.DATA.imageUrl; 
                // this.ngZone.run(() => {
                //     this.imageUrl =
                //         environment.thumbApi + response.imageUrl;
                // });
                this.imgLoaded = true;
                this.toast.showToast('Image updated', 'end').catch();
            });
    }

    private async saveFile(blob: Blob): Promise<string> {
        let filePath: string;
        const file = await this.cordovaFile.writeFile(this.cordovaFile.externalApplicationStorageDirectory +
            'files/', 'image', blob);
        filePath = file.nativeURL;
        return filePath;
    }

    saveInfo(): void {
        this.userInfoService
            .userInfo(this.userInfoForm.value)
            .subscribe(res => {
                if (res) {
                    this.toast.showToast('Updated', 'end').catch();
                    this.router.navigateByUrl('/tab/my-account').catch();
                }
            });
    }

    goback(): void {
        // this.navCtrl.back();
        this.routeService.navigateToBack('ionic');
    }
    cancel(): void {
        this.routeService.navigateToBack('ionic');
    }
}
