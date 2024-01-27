import { Component, OnInit } from '@angular/core';
import { RouteService } from '../shared/services/router.service';
import { LoaderService } from '../shared/loader/loader.service';
import { SharedService } from '../shared/services/shared.service';
import * as interfaces from '@spundan-clients/bookz-interfaces';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../shared/services/toast.service';

@Component({
    selector: 'app-support',
    templateUrl: './support.component.html',
    styleUrls: ['./support.component.scss'],
})
export class SupportComponent implements OnInit {
    constructor(
        private toastService: ToastService,
        private routeService: RouteService,
        private sharedService: SharedService,
        private fb: FormBuilder
    ) { }

    supportFormGroup: FormGroup;
    queryType: string[] = Object.values(interfaces.ITypeOfQuery);

    ngOnInit(): void {
        this.supportForm();
    }

    goback(): void {
        this.routeService.navigateToBack('ionic');
    }

    supportForm(): void {
        this.supportFormGroup = this.fb.group({
            name: [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.pattern('^[a-zA-Z ]+$'),
                ]),
            ],
            email: ['', Validators.required],
            query_type: ['', Validators.required],
            order_no: [''],
            desc: ['', Validators.required],
        });
    }

    addSupportForm(): void {
        this.sharedService.addQuery(this.supportFormGroup.value).subscribe();
        this.toastService.showToast('Support Form submitted', 'end').catch();
        this.goback();
    }
}
