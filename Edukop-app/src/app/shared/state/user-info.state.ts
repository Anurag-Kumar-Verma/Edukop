import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

interface Count {
    value: number;
}

@Injectable({
    providedIn: 'root',
})
export class UserStateService {
    constructor() {
        this.state$ = new BehaviorSubject<number>(0);
    }

    // state$: Observable<number>;
    private state$: BehaviorSubject<number>;

    getUserState(): Observable<number> {
        return this.state$.asObservable();
    }

    setUserState(nextState: number): void {
        this.state$.next(nextState);
    }
}
