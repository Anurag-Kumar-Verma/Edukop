import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BookSetPage } from './product-page';

describe('BookSetPage', () => {
    let component: BookSetPage;
    let fixture: ComponentFixture<BookSetPage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [BookSetPage],
            imports: [IonicModule.forRoot()],
        })
            .compileComponents()
            .catch();

        fixture = TestBed.createComponent(BookSetPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy().catch();
    });
});
