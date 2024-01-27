import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormInputValidationComponent } from './form-input-validation.component';

describe('FormInputValidationComponent', () => {
  let component: FormInputValidationComponent;
  let fixture: ComponentFixture<FormInputValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormInputValidationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormInputValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
