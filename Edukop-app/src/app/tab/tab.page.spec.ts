import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TabPage } from './tab.page';

describe('TabPage', () => {
    let component: TabPage;
    let fixture: ComponentFixture<TabPage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TabPage],
            imports: [IonicModule.forRoot()],
        })
            .compileComponents()
            .catch();

        fixture = TestBed.createComponent(TabPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy().catch();
    });
});
