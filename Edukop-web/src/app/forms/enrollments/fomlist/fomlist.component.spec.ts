import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FomlistComponent } from './fomlist.component';

describe('FomlistComponent', () => {
  let component: FomlistComponent;
  let fixture: ComponentFixture<FomlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FomlistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FomlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
