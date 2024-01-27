import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FormListComponent } from './form-list.component';

describe('FormListComponent', () => {
    let component: FormListComponent;
    let fixture: ComponentFixture<FormListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FormListComponent],
            imports: [IonicModule.forRoot()],
        })
            .compileComponents()
            .catch();

        fixture = TestBed.createComponent(FormListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy().catch();
    });
});
