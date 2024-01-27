import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadByCategoryComponent } from './download-by-category.component';

describe('DownloadByCategoryComponent', () => {
  let component: DownloadByCategoryComponent;
  let fixture: ComponentFixture<DownloadByCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadByCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadByCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
