import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, ViewWillEnter } from '@ionic/angular';
import * as interfaces from '@spundan-clients/bookz-interfaces';
import { TopCategories } from '../dashboard/models/category.model';
import {
    FileTransfer,
    FileTransferObject,
    FileUploadOptions,
} from '@ionic-native/file-transfer/ngx';
import { environment } from 'src/environments/environment';
import { File } from '@ionic-native/file/ngx';

import { DynamicFormService } from '../dynamic-form/services/dynamic-forms.service';
import { LoaderService } from '../shared/loader/loader.service';
import { RouteService } from '../shared/services/router.service';
import { SharedService } from '../shared/services/shared.service';
import { AuthService } from '../auth/services/auth.service';
import { ToastService } from '../shared/services/toast.service';
export interface EnrollmentPopulatedData {
    enrollmentData: interfaces.IEnrollmentForm;
}

@Component({
    selector: 'app-form-list',
    templateUrl: './form-list.component.html',
    styleUrls: ['./form-list.component.scss'],
})
export class FormListComponent implements OnInit, ViewWillEnter {
    // tslint:disable-next-line: no-any
    userId = JSON.parse(localStorage.getItem('userId'));
    myEnrollments: any[] = [];
    schoolUUID: string[] = [];
    schoolData: interfaces.ISchool[];
    enrollmentFormID: string;
    isDataLoaded: boolean = false;
    constructor(
        private navCtrl: NavController,
        public loadingService: LoaderService,
        private sharedService: SharedService,
        private formService: DynamicFormService,
        private router: Router,
        public routeService: RouteService,
        private file: File,
        private transfer: FileTransfer,
        public auth: AuthService,
        private toasterService: ToastService
    ) {}

    ngOnInit(): void {}

    ionViewWillEnter(): void {
        this.getMyEnrollments();
        localStorage.setItem('history-back', '/product-page');
    }

    downloadPdf(form: interfaces.IMyEnrollments, school): void {
        this.formService
            .downloadSubmittedForm(form.enrollmentFormId, form.uuid)
            .subscribe(res => {
                this.router.navigateByUrl(
                    '/tab/pdf-previewer/' + Math.random(),
                    {
                        state: {
                            data: school,
                            path: res,
                        },
                    }
                );
            }),
            error => {
                console.log(error);
            };
    }

    downloadDoc(form: interfaces.IMyEnrollments, school){
        this.loadingService.display(true);
        const url =
        environment.Api +
        `/api/enrollGenerate?enrollmentFormId=${form.enrollmentFormId}&myEnrollmentId=${form.myEnrollmentId}`;
        var fileTransfer = new FileTransfer().create();
        let options: FileUploadOptions = {
          headers: {
            "authtoken": this.auth.currentUserValue
          },
        }
        fileTransfer.download(
            url, (this.file.externalRootDirectory || this.file.dataDirectory) +
          '/Download/Edukop/'+ form.myEnrollmentId +'.pdf', true, options
        ).then((entry)=>{
            this.loadingService.display(false);
            this.toasterService.showToast("Document Downloaded",'end');
            // console.log('download complete: ' + entry.toURL());
           },(error)=>{
            this.loadingService.display(false);
            this.toasterService.showToast("Download Failed",'end');
            // console.log(error,"error")
           });
   
    }

    openPDf(form: interfaces.IMyEnrollments, school) {
        const storagePath =
            this.file.externalApplicationStorageDirectory + 'files/';
        const userPath =
            storagePath + 'bookzeycache/Users/' + this.userId + '/';
        +form.uuid + '/';

        this.loadingService.display(true);
        const url =
            environment.Api +
            `/api/enrollGenerate?enrollmentFormId=${form.enrollmentFormId}&myEnrollmentId=${form.myEnrollmentId}`;
        this.file
            .checkFile(userPath, form.uuid)
            .then(files => {
                if (files) {
                    this.file
                        .readAsArrayBuffer(userPath, form.uuid)
                        .then(res => {
                            this.loadingService.display(false);
                            this.router.navigateByUrl(
                                '/tab/pdf-previewer/' + Math.random(),
                                {
                                    state: {
                                        data: school,
                                        path: res,
                                    },
                                }
                            );
                        })
                        .catch(er => {
                            this.loadingService.display(false);
                        });
                    return;
                }
            })
            .catch(err => {
                console.log(err);
                this.downloadFileToLocal(url, form.uuid, school.name);
            });
    }

    downloadFileToLocal(url: string, uuid: string, schoolName: string) {
        const storagePath =
            this.file.externalApplicationStorageDirectory + 'files/';
        const userPath =
            storagePath + 'bookzeycache/Users/' + this.userId + '/';
        +uuid + '/';
        const fileTransfer: FileTransferObject = this.transfer.create();
        fileTransfer
            .download(url, userPath + uuid, false, {
                headers: {
                    authtoken: this.auth.currentUserValue,
                },
            })
            .then(
                entry => {
                    // this.file.writeFile(
                    //     userPath,

                    //     this.enrollmentFormID
                    // );
                    this.file
                        .readAsArrayBuffer(userPath, uuid)
                        .then(res => {
                            this.loadingService.display(false);
                            this.router.navigateByUrl(
                                '/tab/pdf-previewer/' + Math.random(),
                                {
                                    state: {
                                        data: { name: schoolName },
                                        path: res,
                                    },
                                }
                            );
                        })
                        .catch(er => {
                            this.loadingService.display(false);
                        });
                },
                error => {
                    console.error(error);
                    this.loadingService.display(false);
                }
            );
    }

    getMyEnrollments(): void {
        this.loadingService.display(true);
        this.formService.getMyEnrollments('').subscribe(res => {
            if (history.state?.myEnrollments) {
                this.myEnrollments = history.state?.myEnrollments;
            } else {
                this.myEnrollments = res.DATA.docs;
            }
            this.getSchoolsByUUIDS();
        });
    }
    getSchoolInfo(schoolId: string): interfaces.ISchool {
        return this.schoolData?.find(s => s.uuid === schoolId);
    }

    getSchoolsByUUIDS(): void {
        this.sharedService
            .getSchoolsByIds(
                this.myEnrollments.map(a => a.enrollmentData.school_id)
            )
            .subscribe(res => {
                this.isDataLoaded = true;
                this.schoolData = res.DATA.docs;
                if (this.isDataLoaded) {
                    setTimeout(() => {
                        this.loadingService.display(false);
                    }, 300);
                }
            });
    }

    openCategory(category: TopCategories): void {
        this.router
            .navigateByUrl('/tab/sub-categories/' + Math.random(), {
                state: {
                    type: category.type,
                    filter: category.filter,
                    uuid: category?.uuid,
                },
            })
            .catch();
    }

    back(): void {
        // localStorage.setItem('history-back', '/product-page');
        // const back = localStorage.getItem('form-list-back');
        // back
        //     ? this.navCtrl.navigateBack('/sub-categories')
        //     : this.navCtrl.back();
        const historyState = history.state.lastRoute;
        if (historyState === '/tab/dashboard') {
            this.openCategory(history.state.category);
            //            this.routeService.navigateToBack('ionic');
        } else {
            this.routeService.navigateToBack('ionic');
        }
    }

    openForm(event: any): void {
        this.router
            .navigateByUrl('/tab/dynamic-form/' + Math.random(), {
                state: {
                    enrollmentId: event,
                },
            })
            .catch();
    }
}
