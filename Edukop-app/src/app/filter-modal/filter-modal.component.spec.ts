import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FilterModalComponent } from './filter-modal.component';

describe('FilterModalComponent', () => {
    let component: FilterModalComponent;
    let fixture: ComponentFixture<FilterModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FilterModalComponent],
            imports: [IonicModule.forRoot()],
        })
            .compileComponents()
            .catch();

        fixture = TestBed.createComponent(FilterModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy().catch();
    });
});
