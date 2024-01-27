import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    OnInit,
    ViewChild,
} from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
    AlertController,
    IonContent,
    IonSlides,
    NavController,
} from '@ionic/angular';
import * as interfaces from '@spundan-clients/bookz-interfaces';
import { isEmpty } from 'rxjs/operators';
import { IDynamicForm } from '../models/IDynamicForm.model';
import { LoaderService } from '../shared/loader/loader.service';
import { RouteService } from '../shared/services/router.service';
import { ToastService } from '../shared/services/toast.service';
import { formType } from './model/formType';
import { DynamicFormService } from './services/dynamic-forms.service';

interface FormGroupType {
    fg: FormGroup;
    field: interfaces.IField;
    group: interfaces.IGroup;
    repeatField?: FormGroupType[];
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
    // tslint:disable-next-line: no-any
    optionAnswers?: any;
    repeatIndex?: number;
}

@Component({
    selector: 'app-dynamic-form',
    templateUrl: './dynamic-form.component.html',
    styleUrls: ['./dynamic-form.component.scss'],
})
export class DynamicFormComponent implements OnInit, AfterViewInit {
    @ViewChild(IonContent) ionContent: IonContent;
    @ViewChild('div') div: HTMLElement;
    userFilledForm: FormGroupType[];
    question: interfaces.IGroup[];
    openModal: boolean = false;
    savedAnwers: SavedAnwer[][] = [];
    isUpdate: boolean;
    editIndex: number;
    values: interfaces.IGroup[];
    match: interfaces.IGroup;
    lastSlide: boolean = false;
    status: string;
    // repeatSavedAnswers: SavedAnwer[][] = [];
    repeatSavedAnswers: any[][] = [];
    ans: number;
    questionIndex: number;
    repeatAnswerIndex: number = -1;
    constructor(
        private navCtrl: NavController,
        private formBuilder: FormBuilder,
        private dynamicService: DynamicFormService,
        private cdref: ChangeDetectorRef,
        public alertModal: AlertController,
        public loaderService: LoaderService,
        private router: Router,
        public routeService: RouteService,
        public toastService: ToastService
    ) { }

    formQuestions: IDynamicForm;
    orgType: string = '';
    questionUUID: string;
    @ViewChild('dynamicForm', { static: false })
    dynamicForm: IonSlides;
    // tslint:disable-next-line: no-any
    formAnswers: interfaces.IAnswerState[];
    percentage: number;
    min: string;
    max: string;
    ID: string;
    ngAfterViewInit(): void {
        this.cdref.detectChanges();
        this.dynamicForm.lockSwipeToNext(true).catch();
    }

    ngOnInit(): void {
        this.ID = history.state.enrollmentId.myEnrollmentId;
        this.status = history.state.enrollmentId.formStatus;
        this.userFilledForm = [];
        this.getEnrollment(
            history.state.enrollmentId.enrollmentFormId
                ? history.state.enrollmentId.enrollmentFormId
                : history.state.enrollmentId,
            history.state.name
        );
    }

    // tslint:disable-next-line: typedef
    getFormAnswers(cb = () => { }): void {
        this.dynamicService
            .getAnswer(history.state.enrollmentId?.uuid)
            .subscribe(res => {
                this.formAnswers = res.DATA.docs;
                cb();
            });
    }

    back(): void {
        this.routeService.navigateToBack('ionic');
    }

    getEnrollment(enrollmentId: string, name: string): void {
        this.loaderService.display(true);
        // a555bdb0-e91b-11ea-a77a-0f94ff59e7c6
        this.dynamicService
            .getDynamicFormByEnrollmentId(enrollmentId)
            .subscribe(res => {
                this.getFormAnswers(() => {
                    this.formQuestions = res.DATA;
                    this.orgType = this.formQuestions.orgType;
                    this.values = this.formQuestions.groups;
                    this.setupSurveyForms(this.formAnswers);
                });
            });
    }



    // tslint:disable-next-line: no-any
    private setupSurveyForms(answers: Array<interfaces.IAnswerState>): void {
        this.questionIndex = -1;
        let swipeToIndex = -1;
        let repeatSwipeToIndex = -1;
        // if (this.formQuestions.groups[0].repeatFields) {
        //     questionIndex--;
        // }

        // tslint:disable-next-line: prefer-for-of
        for (let index = 0; index < this.formQuestions.groups.length; index++) {
            if (this.formQuestions.groups[index].repeatFields) {
                let repeatIndex = -1;
                this.questionIndex++;

                const val: FormGroupType[] = [];
                const userAnswer: SavedAnwer[] = [];

                // tslint:disable-next-line: prefer-for-of
                for (
                    let j = 0;
                    j < this.formQuestions.groups[index].fields.length;
                    j++
                ) {
                    repeatIndex++;
                    const field = this.formQuestions.groups[index].fields[j];
                    val[repeatIndex] = {} as FormGroupType;
                    val[repeatIndex].field = field;
                    val[repeatIndex].group = this.formQuestions.groups[index];
                    val[repeatIndex].fg = this.formBuilder.group({
                        answer: new FormControl('', Validators.required),
                        qUUID: new FormControl(field.questionUUID),
                    });
                    const answer = answers.filter(
                        a => a.qUUID === val[repeatIndex].field.questionUUID
                    );

                    this.ans = answer.length;
                    if (answer.length !== 0) {
                        repeatSwipeToIndex = -1;
                        this.saveRepeatAnswers(
                            field,
                            index,
                            answer,
                            userAnswer
                        );
                    } else {
                        swipeToIndex =
                            swipeToIndex === -1 ? this.questionIndex : swipeToIndex; // should swipe to first unanswered question.
                    }
                    if (field.type === formType.CHECKBOXES) {
                        field.values.forEach(op1 => {
                            val[repeatIndex].fg.addControl(
                                this.getFormControlNameForOption(op1.value),
                                new FormControl()
                            );
                        });
                        val[repeatIndex].fg.removeControl('answer');
                        val[repeatIndex].fg.removeControl('qUUID');
                        val[repeatIndex].fg.setValidators(
                            this.requireCheckboxesToBeCheckedValidator()
                        );
                    }
                    // val[repeatIndex].fg.addControl(
                    //     this.getFormControlNameForRepeatFields(repeatIndex),
                    //     new FormControl()
                    // );
                }
                this.userFilledForm[this.questionIndex] = {} as FormGroupType;
                this.userFilledForm[this.questionIndex].repeatField = val;
                this.userFilledForm[this.questionIndex].group =
                    val[repeatIndex].group;
                this.repeatSavedAnswers[this.questionIndex] = [];


                userAnswer.map((b, j) => {
                    if (b.answer) {
                        this.repeatSavedAnswers[this.questionIndex][b.repeatIndex] = userAnswer.filter(
                            a => a.repeatIndex === b.repeatIndex
                        )
                        // this.savedAnwers[b.repeatIndex] = userAnswer.filter(
                        //     a => a.repeatIndex === b.repeatIndex
                        // );
                    }
                });
            } else {
                // tslint:disable-next-line: prefer-for-of
                for (
                    let j = 0;
                    j < this.formQuestions.groups[index].fields.length;
                    j++
                ) {
                    this.questionIndex++;
                    const field = this.formQuestions.groups[index].fields[j];

                    this.userFilledForm[this.questionIndex] = {} as FormGroupType;
                    this.userFilledForm[this.questionIndex].field = field;
                    this.userFilledForm[
                        this.questionIndex
                    ].group = this.formQuestions.groups[index];
                    this.userFilledForm[
                        this.questionIndex
                    ].fg = this.formBuilder.group({
                        answer: new FormControl('', Validators.required),
                        qUUID: new FormControl(field.questionUUID),
                    });
                    if (field.type === formType.EMAIL) {
                        this.userFilledForm[this.questionIndex].fg.controls[
                            'answer'
                        ].setValidators(Validators.email);
                        this.userFilledForm[this.questionIndex].fg.controls[
                            'answer'
                        ].updateValueAndValidity();
                    }
                    const answer = answers.find(
                        a =>
                            a.qUUID ===
                            this.userFilledForm[this.questionIndex].field
                                .questionUUID
                    );
                    if (answer) {
                        this.userFilledForm[this.questionIndex].fg.patchValue({
                            answer: answer.answer1,
                        });
                    } else {
                        swipeToIndex =
                            swipeToIndex === -1 ? this.questionIndex : swipeToIndex; // should swipe to first unanswered question.
                    }
                    if (field.type === formType.CHECKBOXES) {
                        field.values.forEach(op1 => {
                            this.userFilledForm[this.questionIndex].fg.addControl(
                                this.getFormControlNameForOption(op1.value),
                                new FormControl(
                                    answer?.optionAnswers[
                                    this.getFormControlNameForOption(
                                        op1.value
                                    )
                                    ] || false
                                )
                            );
                        });
                        this.userFilledForm[this.questionIndex].fg.removeControl(
                            'answer'
                        );
                        this.userFilledForm[this.questionIndex].fg.setValidators(
                            this.requireCheckboxesToBeCheckedValidator()
                        );
                    }
                }
            }
        }
        if (this.status === 'Completed') {
            setTimeout(async () => {
                this.lastSlide = true;
                await this.dynamicForm.lockSwipes(false);
                await this.dynamicForm.slideTo(this.userFilledForm.length);
                await this.dynamicForm.lockSwipes(true);
            }, 1000);
            this.loaderService.display(false);
            return;
        }
        if (swipeToIndex !== -1) {
            setTimeout(async () => {
                await this.dynamicForm.lockSwipes(false);
                await this.dynamicForm.slideTo(
                    repeatSwipeToIndex !== -1
                        ? repeatSwipeToIndex
                        : swipeToIndex
                );
                await this.dynamicForm.lockSwipes(true);
            }, 1000);
        }
        this.loaderService.display(false);
    }

    getReapeatIndex(val: string): number {
        return this.userFilledForm.findIndex(va => (va.group.title === val))
    }

    private saveRepeatAnswers(
        fieldV: interfaces.IField,
        index: number,
        answer: interfaces.IAnswerState[],
        userAnswer: SavedAnwer[]
    ): void {
        answer.forEach(a => {
            const data = {
                field: fieldV,
                group: this.formQuestions.groups[index],
                qUUID: fieldV.questionUUID,
                answer: a.answer1,
                optionAnswers: a.optionAnswers,
                repeatIndex: a.repeatIndex,
            };
            userAnswer.push(data);
        });
        this.closeFormModal();
    }

    requireCheckboxesToBeCheckedValidator(
        minRequired: number = 1
    ): ValidatorFn {
        return (formGroup: FormGroup) => {
            let checked = 0;
            Object.keys(formGroup.controls).forEach(key => {
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
    // Move to Next slide

    formList(): void {
        this.dynamicService
            .updateMyEnrollmentFormStatus(
                history.state.enrollmentId.myEnrollmentId
            )
            .subscribe();
        localStorage.setItem('form-list-back', 'dynamic-form');
        this.router
            .navigateByUrl('/tab/form-list/' + Math.random(), {
                state: {
                    lastRoute: '/dynamic-form',
                },
                skipLocationChange: true,
            })
            .catch();
    }

    addAnswer(i: number): void {
        this.repeatAnswerIndex = 0
        const d1 = [];
        const userAnswer: SavedAnwer[] = [];
        if (
            this.userFilledForm[i].repeatField.some(
                a => a.fg.status === 'INVALID'
            )
        ) {
            this.toastService.showToast('please fill the field ', 'end');
            return;
        } else {
            this.userFilledForm[i].repeatField.map((a, l) => {
                const data = {
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
                                data.optionAnswers[key] = a.fg.value[key];
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
              //  this.savedAnwers.push(userAnswer);
               // this.repeatSavedAnswers.push(userAnswer);
            } else {
                this.repeatAnswerIndex = this.repeatSavedAnswers.length ? (this.repeatSavedAnswers[i].length + 1) - 1 : 0;
                this.repeatAnswerIndex === 0 ? this.repeatSavedAnswers[i] = [] : '';
                this.repeatSavedAnswers[i][this.editIndex] = userAnswer;
              //  this.savedAnwers[this.editIndex] = userAnswer;
               // this.repeatSavedAnswers[this.editIndex] = userAnswer;
            }
            this.openModal = false;
            this.isUpdate = false;
            this.userFilledForm[i].repeatField.map((v, index) => {
                this.userFilledForm[i].repeatField[index].fg.reset();
            });
        }
    }

    editAnswers(answer: SavedAnwer[], i: number, l: number): void {
        this.openModal = true;
        this.div.scrollTop = this.div.scrollHeight;
        // this.div.scrollToBottom(100);
        this.isUpdate = true;
        this.editIndex = l;
        answer.map((ans, j) => {
            this.userFilledForm[i].repeatField[j].fg.patchValue({
                qUUID: ans.qUUID,
                answer: ans.answer,
                optionAnswers: ans.optionAnswers,
            });
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
          //  this.savedAnwers[l] = answer;
            this.repeatSavedAnswers[i][l] = answer;
           // this.repeatSavedAnswers[l] = answer;
        });
    }

    deleteAnswers(i: number, index: number): void {
        let deleteArray: any[] = []
        this.repeatSavedAnswers[i][index].map(v => {
            if (v.repeatIndex >= 0) {
                const a = {
                    myEnrollmentId: history.state.enrollmentId?.uuid,
                    repeatIndex: v.repeatIndex,
                    qUUID: v.qUUID
                }
                deleteArray.push(a);
            }
        })
        if (deleteArray.length) {
            this.dynamicService.deleteRepeatFields(deleteArray).subscribe(res => {
                this.repeatSavedAnswers[i].splice(index, 1);
                this.repeatSavedAnswers[i].unshift();
            })
        } else {
            this.repeatSavedAnswers[i].splice(index, 1);
            this.repeatSavedAnswers[i].unshift();
        }
    }




    async next(
        slides: IonSlides,
        i: number,
        formGroupField: FormGroupType
    ): Promise<void> {
        this.saveAnswer(i);
    }
    // tslint:disable-next-line: no-any
    getPreviewAnswer(event: any): any {
        const answer = this.formAnswers.find(
            a => a.qUUID === event.questionUUID
        );
        if (event.type === formType.CHECKBOXES) {
            const arrayData: string[] = [];
            event.values.filter(b => {
                // tslint:disable-next-line: strict-boolean-conditions
                if (answer.optionAnswers['option' + b.value]) {
                    arrayData.push(b.key);
                }
            });
            return arrayData.toString();
        } else if (event.type === formType.DROPDOWN) {
            let dropDATA: string;
            event.values.filter(b => {
                if (b.value === answer.answer1) {
                    dropDATA = b.key;
                }
            });
            return dropDATA;
        } else if (event.type === formType.DATE) {
            const d = new Date(answer?.answer1);
            return d.toDateString();
        }
        else {
            return answer?.answer1;
        }
    }

    saveAnswer(i: number): void {
        let answerIndex: number;
        // this.match = this.values.find(e =>
        //     e.fields.find(
        //         e1 => e1.questionUUID === this.userFilledForm[i].fg.value.qUUID
        //     )
        // );
        const answers = [];
        if (this.userFilledForm[i]?.repeatField) {
            const formGroupField = this.userFilledForm[i].repeatField;
            if (!formGroupField.map(a => a.fg.valid)) {
                return;
            }
            this.repeatSavedAnswers[i].map((val, index) => {
                val.map(value => {
                    const answerData = {
                        qUUID: value.qUUID,
                        answer1: value.answer,
                        optionAnswers: value?.optionAnswers,
                        enrollmentFormId:
                            history.state.enrollmentId.enrollmentFormId,
                        myEnrollmentId: history.state.enrollmentId?.uuid,
                        repeatIndex: index,
                    };
                    if (value.field.type === formType.CHECKBOXES) {
                        answerData.optionAnswers = {};
                        if (value.optionAnswers) {
                            Object.keys(value.optionAnswers).forEach(key => {
                                if (key.startsWith('option')) {
                                    answerData.optionAnswers[key] =
                                        value.optionAnswers[key];
                                }
                            });
                        } else {
                            answerData.optionAnswers = null;
                        }
                    }
                    answers.push(answerData);
                    answerIndex = this.formAnswers.findIndex(
                        a => a.qUUID === value.qUUID
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
                this.toastService.showToast('please fill the field ', 'end');
                return;
            }
            const value = formGroupField.fg.value;
            const answerData: interfaces.IAnswerState = {
                qUUID: value.qUUID,
                answer1: value.answer,
                optionAnswers: value?.optionAnswers,
                enrollmentFormId: history.state.enrollmentId.enrollmentFormId,
                myEnrollmentId: history.state.enrollmentId?.uuid,
            };
            if (formGroupField.field.type === formType.CHECKBOXES) {
                answerData.optionAnswers = {};
                Object.keys(formGroupField.fg.value).forEach(key => {
                    if (key.startsWith('option')) {
                        answerData.optionAnswers[key] =
                            formGroupField.fg.value[key];
                    }
                });
            }
            answers.push(answerData);
            answerIndex = this.formAnswers.findIndex(
                a => a.qUUID === value.qUUID
            );
        }
        this.dynamicForm.lockSwipes(false).catch();
        // tslint:disable-next-line: prefer-const
        let save = {} as AddAnswer;
        save.answers = answers;
        save.myEnrollmentId = history.state.enrollmentId?.uuid;
        this.dynamicService.saveAnswer(save).subscribe(async res => {
            if (res.DATA.inserted || res.DATA.updated) {
                if (answerIndex > 0) {
                    if (this.userFilledForm[i].repeatField) {
                        res.DATA.inserted.length
                            ? res.DATA.inserted.map(a => {
                                this.formAnswers[answerIndex] = a;
                            })
                            : res.DATA.updated.map(b => {
                                this.formAnswers[answerIndex] = b;
                            });
                    } else {
                        this.formAnswers[answerIndex] = res.DATA.inserted.length
                            ? res.DATA.inserted[0]
                            : res.DATA.updated[0];
                    }
                } else {
                    if (this.userFilledForm[i].repeatField) {
                        // tslint:disable-next-line: strict-boolean-conditions
                        res.DATA.inserted.length
                            ? res.DATA.inserted.map(a => {
                                this.formAnswers.push(a);
                            })
                            : res.DATA.updated.map(b => {
                                this.formAnswers.push(b);
                            });
                    } else {
                        // tslint:disable-next-line: strict-boolean-conditions
                        res.DATA.inserted.length
                            ? this.formAnswers.push(res.DATA.inserted[0])
                            : this.formAnswers.push(res.DATA.updated[0]);
                    }
                }
                this.lastSlide =
                    i + 1 === this.userFilledForm.length ? true : false;
                if (this.lastSlide) {
                    await this.dynamicForm.slideNext();
                }
                await this.dynamicForm.slideNext();
            } else {
                this.lastSlide =
                    i + 1 === this.userFilledForm.length ? true : false;
                if (this.userFilledForm[i].repeatField) {
                    await this.dynamicForm.slideNext();
                }
            }
            this.dynamicForm.lockSwipes(true).catch();
        });
    }

    async previous(slides: IonSlides): Promise<void> {
        this.dynamicForm.lockSwipes(false).catch();
        await slides.slidePrev();
    }

    getFormControlNameForOption(optionValue: string): string {
        return `option${optionValue}`;
    }

    getFormControlNameForRepeatFields(index: number): string {
        return `answer`;
    }

    async deleteAlert(i: number, l: number): Promise<void> {
        const alert = await this.alertModal.create({
            cssClass: 'my-custom-class',
            header: 'Delete',
            // subHeader: 'Are you surely wants to delete?',
            message: 'Are you sure you want to delete?',
            buttons: [
                'Cancel',
                {
                    text: 'Delete',
                    handler: () => {
                        this.deleteAnswers(i, l);
                    },
                },
            ],
        });

        await alert.present();
    }

    closeFormModal(): void {
        this.openModal = false;
    }
    openFormModal(): void {
        this.openModal = true;
    }
}
