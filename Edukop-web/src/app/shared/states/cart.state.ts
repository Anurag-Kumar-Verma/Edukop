import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CartStateService {
    constructor() {
        this.state$ = new BehaviorSubject<number>(0);
    }

    // state$: Observable<number>;
    private state$: BehaviorSubject<number>;

    getCartState(): Observable<number> {
        return this.state$.asObservable();
    }

    setCartState(nextState: number): void {
        this.state$.next(nextState);
    }

    removeCartState(nextState: number): void {
        this.state$.next(nextState);
    }
}
