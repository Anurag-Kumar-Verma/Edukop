import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { NavController } from '@ionic/angular';
import * as interfaces from '@spundan-clients/bookz-interfaces';
import {
    IBoard,
    ICompetition,
    ISchool,
    IUniversity,
} from '@spundan-clients/bookz-interfaces';
import { environment } from 'src/environments/environment';
// export interface IEnrollment {
//     type: string;
//    schoolData :ISchool[];
// }

@Component({
    selector: 'app-enrollment-form-section',
    templateUrl: './enrollment-form.component.html',
    styleUrls: ['./enrollment-form.component.scss'],
})
export class EnrollmentFormPage implements OnInit, OnDestroy {
    constructor(private navCtrl: NavController) {}
    @Input() schoolData: ISchool[];
    @Input() enrollments: interfaces.IDynamicForm[] = [];
    @Output() OpenFormEmit: EventEmitter<{
        schoolData: string;
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

    formList(): void {
        this.navCtrl.navigateForward('/tab/form-list/' + Math.random()).catch();
        localStorage.setItem('form-list-back', '/sub-categories');
    }
    OpenForm(schoolData: string): void {
        this.OpenFormEmit.emit({
            schoolData,
        });
    }

    getInventory(school: interfaces.ISchool): number {
        let b;
        this.enrollments.forEach(a => {
            if (a.org_id === school.uuid) {
                b = a.inventory;
                return;
            }
        });
        return b;
    }
}
