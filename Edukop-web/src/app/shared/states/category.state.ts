import { Injectable } from "@angular/core";
import * as interfaces from "@spundan-clients/bookz-interfaces";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CategoryStateService {
  test!: interfaces.ICategoryTreeResponse;
  
  private state$: BehaviorSubject<interfaces.ICategoryTreeResponse[]>;
  private st$: BehaviorSubject<interfaces.ICategoryTreeResponse>;

  constructor() {
    this.state$ = new BehaviorSubject<interfaces.ICategoryTreeResponse[]>([]);
    this.st$ = new BehaviorSubject<interfaces.ICategoryTreeResponse>(this.test);
  }

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
