import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SignupPage } from './signup.page';

describe('SignupPage', () => {
    let component: SignupPage;
    let fixture: ComponentFixture<SignupPage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SignupPage],
            imports: [IonicModule.forRoot()],
        })
            .compileComponents()
            .catch();

        fixture = TestBed.createComponent(SignupPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy().catch();
    });
});
