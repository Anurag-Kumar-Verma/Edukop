import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { IBoard } from 'src/app/models/IBoard.model';
import { ICompetition } from 'src/app/models/ICompetition.model';
import { ISchool } from 'src/app/models/ISchool.model';
import { IUniversity } from 'src/app/models/IUniversity.model';
import { environment } from 'src/environments/environment';
export interface ISubCategories {
    type: string;
    categoryData: (IBoard | ISchool | IUniversity | ICompetition)[];
}

@Component({
    selector: 'app-card-view-section',
    templateUrl: './card-view.component.html',
    styleUrls: ['./card-view.component.scss'],
})
export class CardViewPage implements OnInit, OnDestroy, OnChanges {
    @Input() subData: ISubCategories;
    @Output() OpenStListEmit: EventEmitter<{
        info: IBoard  | ISchool | IUniversity | ICompetition;
    }> = new EventEmitter();
    // @Output() OpenDnStListEmit: EventEmitter<{
    //     info: ISubCategories[];
    // }> = new EventEmitter();
    imageApi: string;
    imageEnvUrl: string;
    thumbApi: string;
    ngOnInit(): void {
        this.imageEnvUrl = environment.thumbApi;
        this.imageApi = environment.imageApi;
        this.thumbApi = environment.thumbApi;
    }
    ngOnDestroy(): void {}
    OpenStList(info: IBoard  | ISchool | IUniversity | ICompetition): void {
        this.OpenStListEmit.emit({
            info,
        });
    }

    // OpenDnStList(info: ISubCategories[]): void {
    //         this.OpenDnStListEmit.emit({
    //             info,
    //         });
    //     }

    ngOnChanges() {}
    // OpenChildCategory(
    //     subCategory: IBoard | ISchool | IUniversity | ICompetition
    // ): void {
    //     this.OpenChildCategoryEmit.emit({
    //         subCategory
    //     });
    // }
}
