import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GProductModalComponent } from './g-product-modal.component';

describe('GProductModalComponent', () => {
    let component: GProductModalComponent;
    let fixture: ComponentFixture<GProductModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GProductModalComponent],
            imports: [IonicModule.forRoot()],
        })
            .compileComponents()
            .catch();

        fixture = TestBed.createComponent(GProductModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy().catch();
    });
});
