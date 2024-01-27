import { Observable } from "rxjs";

export interface IState<T> {
    getUserState(): Observable<T>;
    updateState(data: T): void;
}