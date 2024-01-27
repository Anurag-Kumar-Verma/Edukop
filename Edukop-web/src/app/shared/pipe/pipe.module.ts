import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StringFilterByPipe } from './filter.pipe';
import { StandardPipe } from './standard.pipe';

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [        
        StringFilterByPipe,
        StandardPipe
    ],
    exports: [
        StringFilterByPipe,
        StandardPipe
    ],
    providers: [],
})

export class PipeModule { }