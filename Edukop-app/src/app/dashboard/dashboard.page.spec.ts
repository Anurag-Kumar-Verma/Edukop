import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DashboardPage } from './dashboard.page';

describe('DashboardPage', () => {
    let component: DashboardPage;
    let fixture: ComponentFixture<DashboardPage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DashboardPage],
            imports: [IonicModule.forRoot()],
        })
            .compileComponents()
            .catch();

        fixture = TestBed.createComponent(DashboardPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy().catch();
    });
});
