import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DownloadChildCategoryPage } from './download-child-category.page';

describe('DownloadChildCategoryPage', () => {
    let component: DownloadChildCategoryPage;
    let fixture: ComponentFixture<DownloadChildCategoryPage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DownloadChildCategoryPage],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(DownloadChildCategoryPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
