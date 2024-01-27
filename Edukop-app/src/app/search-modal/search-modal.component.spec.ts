import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SearchModalComponent } from './search-modal.component';

describe('SearchModalComponent', () => {
    let component: SearchModalComponent;
    let fixture: ComponentFixture<SearchModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SearchModalComponent],
            imports: [IonicModule.forRoot()],
        })
            .compileComponents()
            .catch();

        fixture = TestBed.createComponent(SearchModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy().catch();
    });
});
