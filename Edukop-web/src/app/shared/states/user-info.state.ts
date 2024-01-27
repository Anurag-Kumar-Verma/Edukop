import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IState } from './IState';

@Injectable({
    providedIn: 'root',
})
export class UserStateService<T extends any = { data: any}> implements IState<T> {
    public content = new BehaviorSubject<T>(null as any);
    constructor() { }

    getUserState(): Observable<T> {
        return this.content.asObservable();
    }

    setUserState(nextState: T): void {
        this.content.next(nextState);
    }

    updateState(data:T){
        console.log(data)
        this.content.next(data);
    }
}
