import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestProductComponent } from './request-product.component';

describe('RequestProductComponent', () => {
  let component: RequestProductComponent;
  let fixture: ComponentFixture<RequestProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestProductComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
