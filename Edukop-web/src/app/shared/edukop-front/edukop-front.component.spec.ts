import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdukopFrontComponent } from './edukop-front.component';

describe('EdukopFrontComponent', () => {
  let component: EdukopFrontComponent;
  let fixture: ComponentFixture<EdukopFrontComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EdukopFrontComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EdukopFrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
