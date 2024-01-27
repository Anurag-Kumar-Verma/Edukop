import { Component, OnInit } from '@angular/core';
import { ChildCategoryService } from '../child-category/services/child-category.service';
import { LoaderService } from '../shared/loader/loader.service';
import * as interfaces from '@spundan-clients/bookz-interfaces';
import { SharedService } from '../shared/services/shared.service';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
export interface IChildCategories {
    type: string;
    list: interfaces.IStandard[] | interfaces.ICourse[];
}
@Component({
    selector: 'app-download-child-category',
    templateUrl: './download-child-category.page.html',
    styleUrls: ['./download-child-category.page.scss'],
})
export class DownloadChildCategoryPage implements OnInit {
    pageNumber: number = 1;
    pageLimit: number = 10;
    List: any[] = [];
    newList: interfaces.IStandard[];
    ChildData: IChildCategories;
    ExamData: any;
    uuid: string;
    type: string;
    name: string;
    Data: any;
    Exam: interfaces.IExam[];
    UniversityData: { type: string; courses: any[] };
    Unvr: any[] = [];
    categoryData: any;
    abbreviation: any;
    action: any;
    schoolUUID: string;
    constructor(
        public router: Router,
        public navCtrl: NavController,
        private classListService: ChildCategoryService,
        public loadingService: LoaderService
    ) {}

    ngOnInit(): void {
        this.Data = history.state;
        this.type = history.state.type;
        this.name = history.state.name;
        this.schoolUUID = history.state.uuid;

        if (this.Data.examdata) {
            this.Data.examdata.forEach((element, index) => {
                this.uuid = element.type;

                // this.examdata[index].uuid = this.pUUID;
                // this.getRating(this.pUUID, index);
            });

            // this.uuid = this.Data.examdata[].uuid;
        } else {
            this.uuid = this.Data.uuid;
        }
        this.getStandards();
        this.getExam(this.uuid);
        this.getCourses(false);
    }

    goback(): void {
        this.navCtrl.back();
    }

    getStateData(): void {
        this.categoryData = this.Data?.categoryData;
        this.abbreviation = this.Data?.abbreviation;
        this.type = this.Data?.type;
        this.name = this.Data?.name;
        this.uuid = this.Data?.id;
        this.action = this.Data?.action;
    }

    childCategory(
        categoryData:
            | interfaces.IBoard
            | interfaces.ISchool
            | interfaces.IUniversity
            | interfaces.ICompetition
    ): void {
        this.router
            .navigateByUrl('/tab/child-category/' + Math.random(), {
                state: {
                    categoryData: categoryData.uuid,
                    abbreviation: categoryData.abbreviation,
                    type: this.type,
                    name: this.name,
                },
            })
            .catch();
    }

    productPage(standard) {
        const data: any = {
            abbreviation: this.abbreviation,
            name: this.categoryData,
            uuid: this.schoolUUID,
            sub_uuid: standard.uuid,
            isDigital: true,
            type: this.type,
            className: standard.name,
        };
        this.router.navigateByUrl('/tab/product-list/' + Math.random(), {
            state: { data },
        });
    }

    getStandards(): void {
        this.loadingService.display(true);
        this.classListService.getStandards().subscribe(res => {
            this.List = res.DATA.docs;
            this.newList = this.List.sort((a, b) =>
                Number(a.abbreviation) > Number(b.abbreviation) ? 1 : -1
            );
            this.loadingService.display(false);
            this.ChildData = {
                type: this.type,
                list: this.newList,
            };
            this.loadingService.display(false);
        });
    }

    getCourses(isFirstLoad: boolean): void {
        this.loadingService.display(true);
        const paginate: interfaces.IPaginate = {
            pageIndex: this.pageNumber,
            pageSize: this.pageLimit,
        };
        this.classListService.getCourses(paginate).subscribe(res => {
            this.Unvr = res.DATA.docs;
            this.UniversityData = {
                type: this.type,
                courses: this.Unvr,
            };
            this.loadingService.display(false);
        });
    }

    getExam(id: string): void {
        this.loadingService.display(true);
        this.classListService.getExam(id).subscribe(response => {
            this.Exam = response.DATA.docs;
            this.ExamData = {
                type: this.type,
                exam: this.Exam,
            };
            this.loadingService.display(false);
        });
    }
}
