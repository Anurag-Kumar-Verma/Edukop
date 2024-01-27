import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SubCategoryPage } from './sub-categories.page';

describe('BoardListPage', () => {
    let component: SubCategoryPage;
    let fixture: ComponentFixture<SubCategoryPage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SubCategoryPage],
            imports: [IonicModule.forRoot()],
        })
            .compileComponents()
            .catch();

        fixture = TestBed.createComponent(SubCategoryPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy().catch();
    });
});
