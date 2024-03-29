import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WishlistPage } from './wishlist.page';

describe('WishlistPage', () => {
    let component: WishlistPage;
    let fixture: ComponentFixture<WishlistPage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [WishlistPage],
            imports: [IonicModule.forRoot()],
        })
            .compileComponents()
            .catch();

        fixture = TestBed.createComponent(WishlistPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy().catch();
    });
});
