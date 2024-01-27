import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CategoryFilter } from './categoryFilter';
import { StandardPipe } from './standard.pipe';

@NgModule({
    declarations: [StandardPipe, CategoryFilter], // <---
    imports: [CommonModule],
    exports: [StandardPipe, CategoryFilter], // <---
})
export class MainPipe {}
