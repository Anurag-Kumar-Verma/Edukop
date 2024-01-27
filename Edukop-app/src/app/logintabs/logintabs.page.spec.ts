import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LogintabsPage } from './logintabs.page';

describe('LogintabsPage', () => {
    let component: LogintabsPage;
    let fixture: ComponentFixture<LogintabsPage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LogintabsPage],
            imports: [IonicModule.forRoot()],
        })
            .compileComponents()
            .catch();

        fixture = TestBed.createComponent(LogintabsPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy().catch();
    });
});
