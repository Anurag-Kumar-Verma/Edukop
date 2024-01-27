import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

interface Count {
    value: number;
}

@Injectable({
    providedIn: 'root',
})
export class internetConnectivityState {

    constructor() {
        this.state$ = new BehaviorSubject<boolean>(true);
    }
    private state$: BehaviorSubject<boolean>;

    getState(): Observable<boolean> {
        return this.state$.asObservable();
    }

    get stateValue(): boolean {
        return this.state$.value || false;
    }

    setState(nextState: boolean): void {
        this.state$.next(nextState);
    }
}
