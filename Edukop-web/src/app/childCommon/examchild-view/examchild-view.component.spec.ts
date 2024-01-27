import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamchildViewComponent } from './examchild-view.component';

describe('ExamchildViewComponent', () => {
  let component: ExamchildViewComponent;
  let fixture: ComponentFixture<ExamchildViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExamchildViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamchildViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
