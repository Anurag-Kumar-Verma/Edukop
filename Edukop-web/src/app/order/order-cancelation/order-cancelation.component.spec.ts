import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderCancelationComponent } from './order-cancelation.component';

describe('OrderCancelationComponent', () => {
  let component: OrderCancelationComponent;
  let fixture: ComponentFixture<OrderCancelationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderCancelationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderCancelationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
