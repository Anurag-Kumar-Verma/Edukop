import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import * as interfaces from '@spundan-clients/bookz-interfaces';
import {
    IBoard,
    ICompetition,
    ISchool,
    IUniversity,
} from '@spundan-clients/bookz-interfaces';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-row-view-section',
    templateUrl: './row-view.component.html',
    styleUrls: ['./row-view.component.scss'],
})
export class RowViewPage implements OnInit, OnDestroy {
    @Input() catFound: interfaces.ICategoryTreeResponse;
    @Output() openCategoryTreeEmit: EventEmitter<{
        catFound;
    }> = new EventEmitter();
    imageApi: string;
    imageEnvUrl: string;
    thumbApi: string;
    ngOnInit(): void {
        this.imageEnvUrl = environment.thumbApi;
        this.imageApi = environment.imageApi;
        this.thumbApi = environment.thumbApi;
    }
    ngOnDestroy(): void {}
    openCategoryTree(catFound): void {
        this.openCategoryTreeEmit.emit({
            catFound,
        });
    }
}
