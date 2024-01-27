import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoColumnSectionComponent } from './two-column-section.component';

describe('TwoColumnSectionComponent', () => {
  let component: TwoColumnSectionComponent;
  let fixture: ComponentFixture<TwoColumnSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TwoColumnSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TwoColumnSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
