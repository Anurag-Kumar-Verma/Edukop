import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrollableSquareSectionComponent } from './scrollable-square-section.component';

describe('ScrollableSquareSectionComponent', () => {
  let component: ScrollableSquareSectionComponent;
  let fixture: ComponentFixture<ScrollableSquareSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScrollableSquareSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScrollableSquareSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
