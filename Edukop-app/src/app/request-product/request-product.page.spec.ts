import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RequestProductPage } from './request-product.page';

describe('RequestProductPage', () => {
    let component: RequestProductPage;
    let fixture: ComponentFixture<RequestProductPage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RequestProductPage],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(RequestProductPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
