import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExamCategoryComponent } from './exam-category.component';

describe('ExamCategoryComponent', () => {
    let component: ExamCategoryComponent;
    let fixture: ComponentFixture<ExamCategoryComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ExamCategoryComponent],
            imports: [IonicModule.forRoot()],
        })
            .compileComponents()
            .catch();

        fixture = TestBed.createComponent(ExamCategoryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy().catch();
    });
});
