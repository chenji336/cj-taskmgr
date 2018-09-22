import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

export interface DragData {
  tag: string; // 标识拖拽id
  data: any;
}

@Injectable()
export class DragDropService {
  // BehaviorSubject总能记住上一次的值，所以每次enter的时候都会触发subscribe
  private _dragData = new BehaviorSubject<DragData>(null);
  // Subject会先记着，当遇到next时候再一次性触发subscribe
  // private _dragData = new Subject<DragData>();

  setDragData(data: DragData) {
    this._dragData.next(data);
  }

  getDragData(): Observable<DragData> {
    return this._dragData.asObservable();
  }

  clearDragData() {
    this._dragData.next(null);
  }

  constructor() { } 
}
