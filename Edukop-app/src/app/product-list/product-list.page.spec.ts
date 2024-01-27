import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProductListPage } from './product-list.page';

describe('ProductListPage', () => {
    let component: ProductListPage;
    let fixture: ComponentFixture<ProductListPage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ProductListPage],
            imports: [IonicModule.forRoot()],
        })
            .compileComponents()
            .catch();

        fixture = TestBed.createComponent(ProductListPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy().catch();
    });
});
