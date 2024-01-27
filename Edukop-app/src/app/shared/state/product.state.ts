import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

interface Count {
    value: number;
}

@Injectable({
    providedIn: 'root',
})
export class ProductStateService {
    constructor() {
        this.state$ = new BehaviorSubject<string>(undefined);
    }

    // state$: Observable<number>;
    private state$: BehaviorSubject<string>;

    getProductState(): Observable<string> {
        return this.state$.asObservable();
    }

    get currentProductValue(): string {
        return this.state$.value || undefined;
    }

    setProductState(nextState: string): void {
        this.state$.next(nextState);
    }
}
