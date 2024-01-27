import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrollableCategorySectionComponent } from './scrollable-category-section.component';

describe('ScrollableCategorySectionComponent', () => {
  let component: ScrollableCategorySectionComponent;
  let fixture: ComponentFixture<ScrollableCategorySectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScrollableCategorySectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScrollableCategorySectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
