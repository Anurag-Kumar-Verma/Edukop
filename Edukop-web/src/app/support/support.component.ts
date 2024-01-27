import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import * as interfaces from "@spundan-clients/bookz-interfaces";
import { NgxSpinnerService } from "ngx-spinner";
import { SharedService } from "../shared/services/shared.service";

@Component({
  selector: "app-support",
  templateUrl: "./support.component.html",
  styleUrls: ["./support.component.scss"],
})
export class SupportComponent implements OnInit {
  supportFormGroup!: FormGroup;
  queryType: string[] = Object.values(interfaces.ITypeOfQuery);

  constructor(
    private fb: FormBuilder,
    public toastService: ToastrService,
    private spinner: NgxSpinnerService,
    public sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.supportForm();
  }

  supportForm() {
    this.supportFormGroup = this.fb.group({
      name: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[a-zA-Z ]+$"),
        ]),
      ],
      email: ["", Validators.compose([Validators.required, Validators.email])],
      query_type: ["Delivery", Validators.required],
      order_no: [""],
      desc: ["", Validators.required],
    });
  }

  cancel() {
    this.supportFormGroup.reset();
    history.back();
  }

  submit() {
    this.spinner.show();
    this.sharedService.addQuery(this.supportFormGroup.value).subscribe(res => {
      if(res) {
        this.toastService.success("They will contact you soon. Thank you.");
        this.spinner.hide();
        this.supportFormGroup.reset();
      }
    }, (error) => {
        this.toastService.error("Something is wrong.");
        this.spinner.hide();
    })
  }
}
