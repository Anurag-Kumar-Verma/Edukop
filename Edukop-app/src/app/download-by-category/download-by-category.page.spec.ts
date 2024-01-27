import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DownloadByCategoryPage } from './download-by-category.page';

describe('DownloadByCategoryPage', () => {
    let component: DownloadByCategoryPage;
    let fixture: ComponentFixture<DownloadByCategoryPage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DownloadByCategoryPage],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(DownloadByCategoryPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
