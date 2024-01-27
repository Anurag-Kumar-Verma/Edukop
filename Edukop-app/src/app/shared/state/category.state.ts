import { Injectable } from '@angular/core';
import * as interfaces from '@spundan-clients/bookz-interfaces';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CategoryStateService {
    constructor() {
        this.state$ = new BehaviorSubject<interfaces.ICategoryTreeResponse[]>(
            undefined
        );
        this.st$ = new BehaviorSubject<interfaces.ICategoryTreeResponse>(
            undefined
        );
    }
    private state$: BehaviorSubject<interfaces.ICategoryTreeResponse[]>;
    private st$: BehaviorSubject<interfaces.ICategoryTreeResponse>;

    getCategoryState(): Observable<interfaces.ICategoryTreeResponse[]> {
        return this.state$.asObservable();
    }

    setCategoryState(nextState: interfaces.ICategoryTreeResponse[]): void {
        this.state$.next(nextState);
    }

    setChildState(nextState: interfaces.ICategoryTreeResponse): void {
        this.st$.next(nextState);
    }
    getChildState(): Observable<interfaces.ICategoryTreeResponse> {
        return this.st$.asObservable();
    }
}
