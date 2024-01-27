import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { IStates } from "@spundan-clients/bookz-interfaces";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { IBoard } from "src/app/model/IBoard.model";
import { IDynamicForm } from "src/app/model/IDynamicForm.model";
import { ISchool } from "src/app/model/ISchool.model";
import { IUniversity } from "src/app/model/IUniversity.model";
import { DynamicFormService } from "src/app/services/dynamicFormService.service";
import { environment } from "src/environments/environment";
import * as interfaces from "@spundan-clients/bookz-interfaces";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { formType } from "src/app/model/formType.model";
import { MatDialog } from "@angular/material/dialog";
import { LoginComponent } from "../../login/login.component";
import { DeleteAlertComponent } from "./delete-alert/delete-alert.component";

interface FormGroupType {
  fg: FormGroup;
  field: interfaces.IField;
  group: interfaces.IGroup;
  repeatField: FormGroupType[];
}

interface AddAnswer {
  answers: interfaces.IAnswerState[];
  myEnrollmentId: string;
}

interface SavedAnwer {
  field: interfaces.IField;
  group: interfaces.IGroup;
  qUUID: string;
  answer: string;
  optionAnswers?: any;
  repeatIndex?: number | any;
}

@Component({
  selector: "app-enrollment-form",
  templateUrl: "./enrollment-form.component.html",
  styleUrls: ["./enrollment-form.component.scss"],
})
export class EnrollmentFormComponent implements OnInit {
  uuid: string = "";
  enrollUUID: string = "";
  status: string = '';
  formID: string = "";
  formDetail!: IDynamicForm;
  formQuestions!: interfaces.IDynamicForm;
  schholDetail!: ISchool | IUniversity | IBoard;
  itemType: string = "";
  stateSearchCtrl: string = "";
  states: IStates[] = [];
  imageApi = environment.imageApi;
  formAnswers: interfaces.IAnswerState[] = [];
  userFilledForm: FormGroupType[] = [];
  question: interfaces.IGroup[] = [];
  openModal: boolean = false;
  savedAnwers: SavedAnwer[][] = [];
  isUpdate: boolean = false;
  lastSlide: boolean = false;
  editIndex: number = -1;
  values: interfaces.IGroup[] = [];
  match!: interfaces.IGroup;
  repeatSavedAnswers: any[][] = [];
  ans: number = -1;
  questionIndex: number = -1;
  currentPage: number = 0;
  repeatAnswerIndex: number = -1;

  constructor(
    public dynamicService: DynamicFormService,
    public toaster: ToastrService,
    public router: Router,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public dialogCtrol: MatDialog
  ) {}

  ngOnInit(): void {
    this.uuid = this.route.snapshot.paramMap.get("id") as string;
    this.route.queryParams.subscribe((params) => {
      if(params) {
        this.formID = JSON.parse(params?.["formId"]);
        this.enrollUUID = JSON.parse(params?.["enrollId"]);
        this.status = JSON.parse(params?.["formStatus"]);
      }
    });

    if(this.status == "completed") {
      this.lastSlide = true;
    } else {
      this.lastSlide = false;
    }

    this.getFormById(this.uuid);
    this.getStates();
    console.log(this.repeatSavedAnswers);
  }

  getFormAnswers(cb = () => {}): void {
    this.dynamicService.getAnswer(this.enrollUUID).subscribe((res) => {
      this.formAnswers = res.DATA.docs;
      cb();
    });
  }

  getFormById(uuid: string) {
    this.spinner.show();
    
    this.dynamicService.getDynamicFormByEnrollmentId(uuid).subscribe((res) => {
      if (res.DATA) {
        this.formDetail = res.DATA as IDynamicForm;
        let item = res.DATA;
        this.formQuestions = res.DATA;
        this.values = this.formQuestions.groups;

        this.getFormAnswers(() => {
          this.formQuestions = res.DATA;
          this.values = this.formQuestions.groups;
          this.setupSurveyForms(this.formAnswers);
        });
        
        this.itemType = item.orgType as string;

        if (this.itemType == "School") {
          this.schholDetail = item.schoolDetail as ISchool;
        } else if (this.itemType == "university") {
          this.schholDetail = item.universityDetails as IUniversity;
        }
      } else {
        this.toaster.error("No Data Found");
        this.spinner.hide();
      }
    }, (error) => {
      this.spinner.hide();
    });
  }

  // -------------------- form setup
  setupSurveyForms(answers: Array<interfaces.IAnswerState>): void {
    this.questionIndex = -1;
    let swipeToIndex = -1;
    let repeatSwipeToIndex = -1;

    for (let index = 0; index < this.formQuestions.groups.length; index++) {
      if (this.formQuestions.groups[index].repeatFields) {
        let repeatIndex = -1;
        this.questionIndex++;

        const val: FormGroupType[] = [];
        const userAnswer: SavedAnwer[] = [];

        for (let j = 0; j < this.formQuestions.groups[index].fields.length; j++) {
          repeatIndex++;
          const field = this.formQuestions.groups[index].fields[j];
          val[repeatIndex] = {} as FormGroupType;
          val[repeatIndex].field = field;
          val[repeatIndex].group = this.formQuestions.groups[index];
          
          val[repeatIndex].fg = this.formBuilder.group({
            answer: new FormControl("", Validators.required),
            qUUID: new FormControl(field.questionUUID),
          });
          
          const answer = answers.filter(
            (a) => a.qUUID === val[repeatIndex].field.questionUUID
          );

          this.ans = answer.length;
          if (answer.length !== 0) {
            repeatSwipeToIndex = -1;
            this.saveRepeatAnswers(field, index, answer, userAnswer);
          } else {
            swipeToIndex = (swipeToIndex === -1) ? this.questionIndex : swipeToIndex;
          }
          if (field.type === formType.CHECKBOXES) {
            field.values.forEach((op1) => {
              val[repeatIndex].fg.addControl(
                this.getFormControlNameForOption(op1.value),
                new FormControl()
              );
            });
            val[repeatIndex].fg.removeControl("answer");
            val[repeatIndex].fg.removeControl("qUUID");
            val[repeatIndex].fg.setValidators(
              this.requireCheckboxesToBeCheckedValidator()
            );
          }
        }

        this.userFilledForm[this.questionIndex] = {} as FormGroupType;
        this.userFilledForm[this.questionIndex].repeatField = val;
        this.userFilledForm[this.questionIndex].group = val[repeatIndex].group;
        this.repeatSavedAnswers[this.questionIndex] = [];

        userAnswer.map((b, j) => {
          if (b.answer) {
            this.repeatSavedAnswers[this.questionIndex][b.repeatIndex] =
              userAnswer.filter((a) => a.repeatIndex === b.repeatIndex);
          }
        });
      } else {

        for (let j = 0; j < this.formQuestions.groups[index].fields.length; j++) {
          this.questionIndex++;
          const field = this.formQuestions.groups[index].fields[j];

          this.userFilledForm[this.questionIndex] = {} as FormGroupType;
          this.userFilledForm[this.questionIndex].field = field;
          this.userFilledForm[this.questionIndex].group = this.formQuestions.groups[index];

          this.userFilledForm[this.questionIndex].fg = this.formBuilder.group({
            answer: new FormControl("", Validators.required),
            qUUID: new FormControl(field.questionUUID),
          });

          if (field.type === formType.EMAIL) {
            this.userFilledForm[this.questionIndex].fg.controls[
              "answer"
            ].setValidators(Validators.email);
            this.userFilledForm[this.questionIndex].fg.controls[
              "answer"
            ].updateValueAndValidity();
          }

          if (answers.length > 0) {
            const answer:any = answers.find(
              (a) =>
                a.qUUID ===
                this.userFilledForm[this.questionIndex].field.questionUUID
            );
            if (answer) {
              this.userFilledForm[this.questionIndex].fg.patchValue({
                answer: answer.answer1,
              });
            } else {
              swipeToIndex = (swipeToIndex === -1) ? this.questionIndex : swipeToIndex;
            }
          
          if (field.type === formType.CHECKBOXES) {
            field.values.forEach((op1) => {
              this.userFilledForm[this.questionIndex].fg.addControl(
                this.getFormControlNameForOption(op1.value),
                new FormControl(
                  answer?.optionAnswers[this.getFormControlNameForOption(op1.value)] || false
                )
              );
            });
            
            this.userFilledForm[this.questionIndex].fg.removeControl("answer");
            this.userFilledForm[this.questionIndex].fg.setValidators(
              this.requireCheckboxesToBeCheckedValidator()
            );
          }
          }
        }
      }
    }
    
    console.log(this.userFilledForm);
    this.currentPage = this.userFilledForm.length
    console.log(this.status);
    if(this.status === "Completed") {
      this.lastSlide = true;
    } else if(this.status !== "Completed") {
      if(this.currentPage = this.userFilledForm.length) {
        this.lastSlide = true;
      } else {
        this.lastSlide = false;
      }
    }
    console.log("current page: ", this.currentPage, "\nlast slide: ", this.lastSlide);
    this.spinner.hide();
  }

  getFormControlNameForOption(optionValue: string): string {
    return `option${optionValue}`;
  }

  getFormControlNameForRepeatFields(index: number): string {
    return `answer`;
  }
  
  requireCheckboxesToBeCheckedValidator(minRequired: number = 1): ValidatorFn {
    return (formGroup: any): any | null => {
      // return (formGroup: FormControl) => {
      let checked = 0;
      Object.keys(formGroup.controls).forEach((key) => {
        const control = formGroup.controls[key];

        if (control.value === true) {
          checked++;
        }
      });
      if (checked < minRequired) {
        return {
          requireCheckboxesToBeChecked: true,
        };
      }
      return undefined;
    };
  }

  saveRepeatAnswers(
    fieldV: interfaces.IField,
    index: number,
    answer: interfaces.IAnswerState[],
    userAnswer: SavedAnwer[]
  ): void {
    answer.forEach((a) => {
      const data = {
        field: fieldV,
        group: this.formQuestions.groups[index],
        qUUID: fieldV.questionUUID,
        answer: a.answer1,
        optionAnswers: a.optionAnswers,
        repeatIndex: a.repeatIndex,
      };
      userAnswer.push(data as any);
    });
  }

  saveAnswer(i: number) {
    let answerIndex: number;
    const answers = [];

    if (this.userFilledForm[i]?.repeatField) {
      const formGroupField = this.userFilledForm[i].repeatField;
      if (formGroupField && !formGroupField.map((a) => a.fg.valid)) {
        return;
      }
      console.log(this.repeatSavedAnswers);
      this.repeatSavedAnswers[i].map((val, index) => {
        val.map((value: any) => {
          const answerData = {
            qUUID: value.qUUID,
            answer1: value.answer,
            optionAnswers: value?.optionAnswers,
            enrollmentFormId: this.uuid,
            myEnrollmentId: this.enrollUUID,
            repeatIndex: index,
          };

          if (value.field.type === formType.CHECKBOXES) {
            answerData.optionAnswers = {};
            if (value.optionAnswers) {
              Object.keys(value.optionAnswers).forEach((key) => {
                if (key.startsWith("option")) {
                  answerData.optionAnswers[key] = value.optionAnswers[key];
                }
              });
            } else {
              answerData.optionAnswers = null;
            }
          }
          
          answers.push(answerData);
          answerIndex = this.formAnswers.findIndex(
            (a) => a.qUUID === value.qUUID
          );
        });
      });

      this.userFilledForm[i].repeatField.map((v, index) => {
        this.userFilledForm[i].repeatField[index].fg.reset();
      });
      this.openModal = false;
      this.isUpdate = false;
    } else {
      const formGroupField = this.userFilledForm[i];
      if (!formGroupField.fg.valid) {
        this.toaster.error("Please fill the field");
        this.currentPage = i;
        return;
      }

      const value = formGroupField.fg.value;
      const answerData: interfaces.IAnswerState |undefined |any = {
        qUUID: value.qUUID,
        answer1: value.answer,
        optionAnswers: value?.optionAnswers,
        enrollmentFormId: this.uuid,
        myEnrollmentId: this.enrollUUID,
      };

      if (formGroupField.field.type === formType.CHECKBOXES) {
        answerData.optionAnswers = {};
        Object.keys(formGroupField.fg.value).forEach((key) => {
          if (key.startsWith("option")) {
            answerData.optionAnswers[key] = formGroupField.fg.value[key];
          }
        });
      }
      answers.push(answerData);
      console.log(typeof this.formAnswers);
      console.log(this.formAnswers);
      answerIndex = this.formAnswers.findIndex((a) => a.qUUID === value.qUUID);
    }

    let save = {} as AddAnswer;
    save.answers = answers;
    save.myEnrollmentId = this.enrollUUID;

    this.dynamicService.saveAnswer(save).subscribe(async (res) => {
      console.log(res.DATA);
      if (res.DATA.inserted || res.DATA.updated) {
        if (answerIndex > 0) {
          if (this.userFilledForm[i].repeatField) {
            res.DATA.inserted.length
              ? res.DATA.inserted.map((a) => {
                  this.formAnswers[answerIndex] = a;
                })
              : res.DATA.updated.map((b) => {
                  this.formAnswers[answerIndex] = b;
                });
          } else {
            this.formAnswers[answerIndex] = res.DATA.inserted.length
              ? res.DATA.inserted[0]
              : res.DATA.updated[0];
          }
        } else {
          if (this.userFilledForm[i].repeatField) {
            res.DATA.inserted.length
              ? res.DATA.inserted.map((a) => {
                  this.formAnswers.push(a);
                })
              : res.DATA.updated.map((b) => {
                  this.formAnswers.push(b);
                });
          } else {
            res.DATA.inserted.length
              ? this.formAnswers.push(res.DATA.inserted[0])
              : this.formAnswers.push(res.DATA.updated[0]);
          }
        }

        this.lastSlide = i + 1 === this.userFilledForm.length ? true : false;
        // if (this.lastSlide) {
        //   await this.dynamicForm.slideNext();
        // }
        // await this.dynamicForm.slideNext();

        if(this.currentPage < this.userFilledForm.length){
          this.currentPage++;
        }
      } else {
        this.lastSlide = i + 1 === this.userFilledForm.length ? true : false;

        // if (this.userFilledForm[i].repeatField) {
        //   await this.dynamicForm.slideNext();
        // }
      }
      // this.dynamicForm.lockSwipes(true).catch();
      console.log(this.lastSlide);
    });
  }

  getPreviewAnswer(event: any) {
    const answer:interfaces.IAnswerState | undefined |any = this.formAnswers.find(
      a => a.qUUID === event.questionUUID
    );

    if (event.type === formType.CHECKBOXES) {
      const arrayData: string[] = [];
      event.values.filter((b: any) => {
        if (answer && answer.optionAnswers['option' + b.value]) {
          arrayData.push(b.key);
        }
      });
      return arrayData.toString();

    } else if (event.type === formType.DROPDOWN) {
      let dropDATA: string = '';

      event.values.filter((b: any) => {
        if (answer && b.value === answer.answer1) {
          dropDATA = b.key;
        }
      });
      return dropDATA;

    } else if (event.type === formType.DATE && answer) {
      const d = new Date(answer?.answer1);
      return d.toDateString();

    } else {
      return answer?.answer1;
    }
  }

  formList(){
    this.spinner.show();
    this.dynamicService.updateMyEnrollmentFormStatus(this.formID).subscribe((res: any) => {
      if(res.DATA.formStatus == "Completed") {
        this.toaster.success("Form submitted succesfully.")
        this.router.navigate(['/side/form-list/']);
        this.spinner.hide();
      } else {
        console.log("wrong")
      }
    }, (error) => {
      this.toaster.error("Something wrong");
      this.spinner.hide();
    });
  }

  addAnswer(i: number): void {
    this.repeatAnswerIndex = 0;
    const d1: any[] = [];
    const userAnswer: SavedAnwer[] = [];
    
    if (this.userFilledForm[i].repeatField.some(a => a.fg.status === 'INVALID')) {
      this.toaster.error('please fill the field ');
      return;

    } else {
      this.userFilledForm[i].repeatField.map((a, l) => {
        const data: string | any = {
          field: a.field,
          group: a.group,
          qUUID: a.field.questionUUID,
          answer: a.fg.value.answer,
          optionAnswers: {},
          repeatIndex: this.isUpdate ? this.repeatSavedAnswers[i][this.editIndex][l].repeatIndex : undefined
        };

        if (a.field.type === formType.CHECKBOXES) {
          data.answer = {};
          data.optionAnswers = {};

          Object.keys(a.fg.value).forEach(key => {
            if (key.startsWith('option')) {
              if (a.fg.value[key] === true) {
                data.optionAnswers[key]  = a.fg.value[key];
                
                a.field.values.map(b => {
                  if ('option' + b.value === key) {
                    d1.push(b.key);
                    return;
                  }
                });
                data.answer = d1;
              } else {
                return;
              }
            }
          });
        }

        console.log(this.repeatSavedAnswers);

        if (a.field.type === formType.DROPDOWN) {
          data.answer = {};
          data.optionAnswers = {};
          a.field.values.forEach(key => {
            if (key.value === a.fg.value.answer) {
              data.answer = key.value;
              data.optionAnswers = key;
            }
          });
        }
        userAnswer.push(data);
      });

      if (!this.isUpdate) {
        this.repeatAnswerIndex = this.repeatSavedAnswers.length ? (this.repeatSavedAnswers[i].length + 1) - 1 : 0;
        this.repeatAnswerIndex === 0 ? this.repeatSavedAnswers[i] = [] : '';
        this.repeatSavedAnswers[i][this.repeatAnswerIndex] = userAnswer;
      } else {
        this.repeatAnswerIndex = this.repeatSavedAnswers.length ? (this.repeatSavedAnswers[i].length + 1) - 1 : 0;
        this.repeatAnswerIndex === 0 ? this.repeatSavedAnswers[i] = [] : '';
        this.repeatSavedAnswers[i][this.editIndex] = userAnswer;
      }

    console.log(this.repeatSavedAnswers);
      this.openModal = false;
      this.isUpdate = false;
      
      this.userFilledForm[i].repeatField.map((v, index) => {
        this.userFilledForm[i].repeatField[index].fg.reset();
      });
    }
  }

  editAnswers(answer: SavedAnwer[], i: number, l: number): void {
    this.openModal = true;
    this.isUpdate = true;
    this.editIndex = l;

    if(this.userFilledForm[i]?.repeatField){
      answer.map((ans, j) => {
        if(this.userFilledForm[i]?.repeatField[j]){
          this.userFilledForm[i].repeatField[j].fg.patchValue({
            qUUID: ans.qUUID,
            answer: ans.answer,
            optionAnswers: ans.optionAnswers,
          });
        }
        
        if (ans.field.type === formType.CHECKBOXES) {
          Object.keys(ans.optionAnswers).forEach((key, k) => {
            if (key.startsWith('option')) {
              this.userFilledForm[i].repeatField[j].fg.removeControl(
                key
              );
              this.userFilledForm[i].repeatField[j].fg.addControl(
                key,
                new FormControl(ans.optionAnswers[key])
              );
            }
          });
        }
        this.repeatSavedAnswers[i][l] = answer;
      });
    }
  }

  deleteAnswers(i: number, index: number): void {
    console.log(i, ": i\n", index, ": index")
    let deleteArray: any[] = [];
    console.log(this.repeatSavedAnswers[i]);

    this.repeatSavedAnswers[i][index].map((v: any) => {
      if (v.repeatIndex >= 0) {
        const a = {
          myEnrollmentId: history.state.enrollmentId?.uuid,
          repeatIndex: v.repeatIndex,
          qUUID: v.qUUID
        }
        deleteArray.push(a);
      }
    });

    if (deleteArray.length) {
      this.dynamicService.deleteRepeatFields(deleteArray).subscribe(res => {
        this.repeatSavedAnswers[i].splice(index, 1);
        this.repeatSavedAnswers[i].unshift();
      });
    } else {
      this.repeatSavedAnswers[i].splice(index, 1);
      this.repeatSavedAnswers[i].unshift();
    }
    console.log(this.repeatSavedAnswers);
  }

  deleteAlert(i: number, l: number) {
    const alert = this.dialogCtrol.open(DeleteAlertComponent, {
      panelClass: "deleteForm",
      minWidth: "300px",
      data: {
        header: 'Delete',        
        message: 'Are you sure you want to delete?',
      }
    });

    alert.afterClosed().subscribe(result => {
      if(result == "delete") {
        this.deleteAnswers(i, l);
        this.toaster.success("Deleted Successfully.");
      }
    });
  }

  closeFormModal() {
    this.openModal = false;
  }

  openFormModal() {
    this.openModal = !this.openModal;
  }

  async previous(i: number): Promise<void> {
    if(this.currentPage > 0){
      this.currentPage--;
    }
  }

  async next(i: number, formGroupField: FormGroupType): Promise<void> {
    this.saveAnswer(i);
  }

  prev(){
    this.lastSlide = false;
    this.currentPage--;
  }

  getReapeatIndex(val: string) {
    return this.userFilledForm.findIndex(va => (va.group.title === val))
  }

  keydown(event: any, i: number, formGroupField: FormGroupType) {
    if(event.keyCode == 13) {
      this.next(i, formGroupField);
    } else {
      return;
    }
  }

  getStates(): void {
    this.dynamicService.getStates().subscribe((response) => {
      this.states = response;
    });
  }

  back() {
    history.back();
  }
}
