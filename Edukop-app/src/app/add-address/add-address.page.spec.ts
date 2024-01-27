import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddAddressPage } from './add-address.page';

describe('AddAddressPage', (): void => {
    let component: AddAddressPage;
    let fixture: ComponentFixture<AddAddressPage>;

    beforeEach(async((): void => {
        TestBed.configureTestingModule({
            declarations: [AddAddressPage],
            imports: [IonicModule.forRoot()],
        })
            .compileComponents()
            .catch();

        fixture = TestBed.createComponent(AddAddressPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', (): void => {
        expect(component).toBeTruthy().catch();
    });
});
