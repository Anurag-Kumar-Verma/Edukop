import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CartPage } from './cart.page';

describe('CartPage', () => {
    let component: CartPage;
    let fixture: ComponentFixture<CartPage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CartPage],
            imports: [IonicModule.forRoot()],
        })
            .compileComponents()
            .catch();

        fixture = TestBed.createComponent(CartPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy().catch();
    });
});
