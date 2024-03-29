import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AllCategoriesPage } from './all-categories.page';

describe('AllCategoriesPage', () => {
    let component: AllCategoriesPage;
    let fixture: ComponentFixture<AllCategoriesPage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AllCategoriesPage],
            imports: [IonicModule.forRoot()],
        })
            .compileComponents()
            .catch();

        fixture = TestBed.createComponent(AllCategoriesPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy().catch();
    });
});
