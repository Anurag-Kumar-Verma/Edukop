import { Pipe, PipeTransform } from '@angular/core';
import * as interfaces from '@spundan-clients/bookz-interfaces';

@Pipe({ name: 'categoryFilter' })
export class CategoryFilter implements PipeTransform {
    transform(
        categoryTree: interfaces.ICategoryTreeResponse[],
        searchString?: string
    ): interfaces.ICategoryTreeResponse[] {
        if (searchString && searchString.trim() !== '') {
            this.filterData(categoryTree, searchString);
        } else {
            this.filterData(categoryTree, '');
        }
        return categoryTree;
    }

    filterData(
        data: Array<interfaces.ICategoryTreeResponse>,
        searchString: string
    ): void {
        data?.forEach(o => {
            if (o.childs) {
                this.filterData(o.childs, searchString);
            }
            o.show =
                searchString === ''
                    ? undefined
                    : (o.childs && o.childs.some(c => c.show)) ||
                      o.name.toLowerCase().indexOf(searchString.toLowerCase()) >
                          -1;
        });
    }
}
