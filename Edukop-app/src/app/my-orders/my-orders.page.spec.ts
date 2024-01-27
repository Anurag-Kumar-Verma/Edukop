import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MyOrdersPage } from './my-orders.page';

describe('MyOrdersPage', () => {
    let component: MyOrdersPage;
    let fixture: ComponentFixture<MyOrdersPage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MyOrdersPage],
            imports: [IonicModule.forRoot()],
        })
            .compileComponents()
            .catch();

        fixture = TestBed.createComponent(MyOrdersPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy().catch();
    });
});
