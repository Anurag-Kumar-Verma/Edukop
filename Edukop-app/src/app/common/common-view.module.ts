import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { BannerSectionPage } from './banner-section/banner-section.component';
import { ScrollableCircleSectionPage } from './scrollable-circle-section/scrollable-circle-section.component';
import { ScrollableSquareSectionPage } from './scrollable-square-section/scrollable-square-section.component';
import { SingleImageSectionPage } from './single-image/single-image.component';
import { TwoColumnSectionPage } from './two-column-section/two-column-section.component';

@NgModule({
    imports: [CommonModule, FormsModule, IonicModule],
    declarations: [
        SingleImageSectionPage,
        BannerSectionPage,
        ScrollableCircleSectionPage,
        ScrollableSquareSectionPage,
        TwoColumnSectionPage,
    ],
    exports: [
        SingleImageSectionPage,
        BannerSectionPage,
        ScrollableCircleSectionPage,
        ScrollableSquareSectionPage,
        TwoColumnSectionPage,
    ],
})
export class CommonViewModule {}
