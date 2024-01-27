import { Component, OnInit } from '@angular/core';
import {
    CameraResultType, Camera,
} from '@capacitor/camera';
import { AuthService } from '../auth/services/auth.service';
import {
    FileTransfer,
    FileUploadOptions,
    FileTransferObject,
} from '@ionic-native/file-transfer/ngx';
import { environment } from 'src/environments/environment';
import { ToastService } from '../shared/services/toast.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as interfaces from '@spundan-clients/bookz-interfaces';
// import { Interface } from 'readline';
// import { NetworkInterfaceBase } from 'os';
import { SharedService } from '../shared/services/shared.service';
import { LoaderService } from '../shared/loader/loader.service';
import { RouteService } from '../shared/services/router.service';
import { File } from '@ionic-native/file/ngx';
import { ActionSheetController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
@Component({
    selector: 'app-request-product',
    templateUrl: './request-product.page.html',
    styleUrls: ['./request-product.page.scss'],
})
export class RequestProductPage implements OnInit {
    RequestProductForm: FormGroup;
    // imageUrl: string;
    imgLoaded: boolean = true;
    name: string;
    description: string;
    image: string;
    imageUrl: string;
    formData: FormData;
    resUUID: any;
    filePath: string;

    constructor(
        private fb: FormBuilder,
        public toast: ToastService,
        private authService: AuthService,
        public sharedService: SharedService,
        public toaster: ToastService,
        public loaderService: LoaderService,
        private transfer: FileTransfer,
        public routeService: RouteService,
        private cordovaFile: File,
        public actionSheetController: ActionSheetController,
        public router: Router
    ) {}

    ngOnInit() {
        this.RequestProduct();
    }

    RequestProduct(): void {
        this.RequestProductForm = this.fb.group({
            productName: ['', Validators.required],
            Description: [''],
        });
    }

    // async selectImage(): Promise<void> {
    //     const actionSheet = await this.actionSheetController.create({
    //         header: 'Pick your profile photo',
    //         buttons: [
    //             {
    //                 text: 'From Gallery',
    //                 handler: () => {
    //                     this.takePicture(
    //                         this.camera.PictureSourceType.SAVEDPHOTOALBUM,
    //                         this.camera.DestinationType.DATA_URL,
    //                         'gallery'
    //                     );
    //                 },
    //             },
    //             {
    //                 text: 'From Camera',
    //                 handler: () => {
    //                     this.takePicture(
    //                         this.camera.PictureSourceType.CAMERA,
    //                         this.camera.DestinationType.DATA_URL,
    //                         'camera'
    //                     );
    //                 },
    //             },
    //             {
    //                 text: 'Cancel',
    //                 role: 'cancel',
    //             },
    //         ],
    //     });
    //     await actionSheet.present();
    // }

    b64toBlob(b64Data, contentType) {
        contentType = contentType || '';
        var sliceSize = 512;
        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (
            var offset = 0;
            offset < byteCharacters.length;
            offset += sliceSize
        ) {
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

    takePicture(): void {
        this.imgLoaded = false;
        let options= {
            quality: 100,
            resultType: CameraResultType.Uri
            //  allowEdit: true
        };
        Camera.getPhoto(options).then(
            imagePath => {
                let data12 = Capacitor.convertFileSrc(imagePath.path);
                // console.log(data12,'data12');
                this.uploadUserImage(imagePath.path);
                // this.filePath = imagePath.path
                // let base64Image = 'data:image/jpeg;base64,' + imagePath;
                // this.imageUrl = base64Image;
                // this.imgLoaded = true;
                // // if (action === 'camera') {
                // let blob = this.b64toBlob(imagePath, 'image/jpeg');
                // this.cordovaFile
                //     .checkFile(
                //         this.cordovaFile.externalApplicationStorageDirectory +
                //             'files/',
                //         'reqImage'
                //     )
                //     .then(files => {
                //         if (files) {
                //             this.cordovaFile
                //                 .removeFile(
                //                     this.cordovaFile
                //                         .externalApplicationStorageDirectory +
                //                         'files/',
                //                     'reqImage'
                //                 )
                //                 .then(a => {
                //                     this.saveFile(blob).then(a => {
                //                         this.filePath = a;
                //                     });
                //                 });
                //         }
                //     })
                //     .catch(err => {
                //         this.saveFile(blob).then(a => {
                //             this.filePath = a;
                //         });
                //     });
                //   }
            },
            error => {
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
        fileTransfer
            .upload(
                filePath,
                environment.Api + `/request2?uuid=${this.resUUID}`,
                options1
            )
            .then(res => {
                let response = JSON.parse(res.response);
                this.imageUrl =
                    environment.thumbApi + response.DATA.imageUrl; 
                this.toast
                    .showToast('Product Request Submitted ', 'end')
                    .catch();
                this.imgLoaded = true;
                this.goback();
            });
    }

    private async saveFile(blob: Blob): Promise<string> {
        let filePath: string;
        const file = await this.cordovaFile.writeFile(
            this.cordovaFile.externalApplicationStorageDirectory + 'files/',
            'reqImage',
            blob
        );
        filePath = file.nativeURL;
        return filePath;
    }

    addRequest() {
        //   this.loaderService.display(true);
        const request: interfaces.IRequestProduct = {
            name: this.name,
            description: this.description,
            uuid: this.resUUID || undefined,
            userId: undefined,
        };

        this.sharedService.addRequest(request).subscribe(res => {
            if (res) {
                this.resUUID = res.DATA.uuid;
                // this.uploadUserImage(this.filePath);
                this.toast
                .showToast('Product Request Submitted ', 'end')
                .catch();
            }
        });
    }

    uploadImage() {
        let form = new FormData();

        form.append('imagePath', this.imageUrl);
        this.sharedService
            .uploadRequestImage(form, this.resUUID)
            .subscribe(res => {
                if (res) {
                    this.toast
                        .showToast('Product Request Submitted ', 'end')
                        .catch();
                    // this.router.navigateByUrl('/tab/my-account').catch();
                    this.goback();
                }
            });
    }

    goback(): void {
        // this.navCtrl.back();
        this.routeService.navigateToBack('ionic');
    }
}
