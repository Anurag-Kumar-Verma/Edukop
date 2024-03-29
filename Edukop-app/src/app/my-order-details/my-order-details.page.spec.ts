import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MyOrderDetailsPage } from './my-order-details.page';

describe('MyOrderDetailsPage', () => {
    let component: MyOrderDetailsPage;
    let fixture: ComponentFixture<MyOrderDetailsPage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MyOrderDetailsPage],
            imports: [IonicModule.forRoot()],
        })
            .compileComponents()
            .catch();

        fixture = TestBed.createComponent(MyOrderDetailsPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy().catch();
    });
});
