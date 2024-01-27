import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewsSectionPage } from './news-section.page';

describe('NewsSectionPage', () => {
  let component: NewsSectionPage;
  let fixture: ComponentFixture<NewsSectionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsSectionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewsSectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
