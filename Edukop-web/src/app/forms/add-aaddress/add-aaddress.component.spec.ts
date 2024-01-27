import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAaddressComponent } from './add-aaddress.component';

describe('AddAaddressComponent', () => {
  let component: AddAaddressComponent;
  let fixture: ComponentFixture<AddAaddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAaddressComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAaddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
