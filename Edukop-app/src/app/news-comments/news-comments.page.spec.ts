import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewsCommentsPage } from './news-comments.page';

describe('NewsCommentsPage', () => {
  let component: NewsCommentsPage;
  let fixture: ComponentFixture<NewsCommentsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsCommentsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewsCommentsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
