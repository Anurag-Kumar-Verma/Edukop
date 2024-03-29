import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserInfoPage } from './user-info.page';

describe('UserInfoPage', () => {
    let component: UserInfoPage;
    let fixture: ComponentFixture<UserInfoPage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UserInfoPage],
            imports: [IonicModule.forRoot()],
        })
            .compileComponents()
            .catch();

        fixture = TestBed.createComponent(UserInfoPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy().catch();
    });
});
