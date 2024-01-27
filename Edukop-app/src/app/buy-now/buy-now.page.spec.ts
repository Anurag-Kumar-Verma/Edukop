import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BuyNowPage } from './buy-now.page';

describe('BuyNowPage', () => {
    let component: BuyNowPage;
    let fixture: ComponentFixture<BuyNowPage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [BuyNowPage],
            imports: [IonicModule.forRoot()],
        })
            .compileComponents()
            .catch();

        fixture = TestBed.createComponent(BuyNowPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy().catch();
    });
});
