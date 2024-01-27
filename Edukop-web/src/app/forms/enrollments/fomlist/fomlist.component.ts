import { Component, OnInit } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { DynamicFormService } from "src/app/services/dynamicFormService.service";
import * as interfaces from "@spundan-clients/bookz-interfaces";
import { SharedService } from "src/app/shared/services/shared.service";
import { environment } from "src/environments/environment";
import { NavigationExtras, Router } from "@angular/router";

@Component({
  selector: "app-fomlist",
  templateUrl: "./fomlist.component.html",
  styleUrls: ["./fomlist.component.scss"],
})
export class FomlistComponent implements OnInit {
  myEnrollments: any[] = [];
  schoolUUID: string[] = [];
  schoolData: interfaces.ISchool[] = [];
  imageApi = environment.imageApi;

  constructor(
    public formService: DynamicFormService,
    private spinner: NgxSpinnerService,
    public toaster: ToastrService,
    public sharedService: SharedService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.getMyEnrollments();
  }

  getMyEnrollments(): void {
    this.spinner.show();
    this.formService.getMyEnrollments("").subscribe((res) => {
      this.myEnrollments = res.DATA.docs;
      this.getSchoolsByUUIDS();
      this.spinner.hide();
    });
  }

  getSchoolsByUUIDS(): void {
    this.spinner.show();
    this.sharedService.getSchoolsByIds(
      this.myEnrollments.map((a) => a.enrollmentData.org_id)
    )
    .subscribe((res) => {
      this.schoolData = res.DATA.docs;
      this.spinner.hide();
    });
  }

  getSchoolInfo(schoolId: string): interfaces.ISchool {
    return this.schoolData?.find((s) => s.uuid === schoolId) as interfaces.ISchool;
  }

  back() {
    history.back();
  }

  openForm(event: Event, enrollmentFormId: string, enrollId: string, uuid: string, status: string) {
    event.stopPropagation();
    let navigationExtras: NavigationExtras = {
      queryParams: {
        formId: JSON.stringify(enrollId),
        enrollId: JSON.stringify(uuid),
        formStatus: JSON.stringify(status)
      }
    }
    this.router.navigate([`/enrollment-form/${enrollmentFormId}`], navigationExtras);
  }
  downloadPDF(event: Event, enrollmentFormId: string, enrollmentId: string){
    event.stopPropagation();
    this.formService.downloadSubmittedForm(enrollmentFormId, enrollmentId).subscribe(res => this.downloadFile(res));
  }
  
  private downloadFile(data: any){
    const blob = new Blob([data], {type: 'application/pdf'});
    const url = window.URL.createObjectURL(blob);
    window.open(url)
  }
}
