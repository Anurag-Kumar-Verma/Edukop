import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import * as interfaces from '@spundan-clients/bookz-interfaces';
import { IStandard, ICourse } from '@spundan-clients/bookz-interfaces';
import { LoaderService } from 'src/app/shared/loader/loader.service';
import { environment } from 'src/environments/environment';
export interface IExamCategories {
    type: string;
    exam: any;
}

@Component({
    selector: 'app-exam-child-view-section',
    templateUrl: './exam-child-view.component.html',
    styleUrls: ['./exam-child-view.component.scss'],
})
export class ExamChildViewPage implements OnInit, OnDestroy, OnChanges {
    @Input() examData: IExamCategories;
    @Output() productPageEmit: EventEmitter<{
        examData: interfaces.IExam;
    }> = new EventEmitter();
    imageApi: string;
    imageEnvUrl: string;
    thumbApi: string;

    constructor(public loaderService: LoaderService) {}

    ngOnInit(): void {
        this.imageEnvUrl = environment.thumbApi;
        this.imageApi = environment.imageApi;
        this.thumbApi = environment.thumbApi;
    }
    ngOnDestroy(): void {}

    ngOnChanges(): void {
        this.examData?.exam?.length > 0
            ? this.loaderService.display(false)
            : this.loaderService.display(true);
    }

    productPage(examData: interfaces.IExam): void {
        this.productPageEmit.emit({
            examData,
        });
    }
}
