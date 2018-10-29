import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import * as actions from '../actions/task-list.action';
import * as fromRoot from '../reducers';
import { TaskListService } from '../services/task-list.service';
@Injectable()
export class TaskListEffects {

  @Effect()
  loadTaskLists$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.LOAD),
    map((action: actions.LoadAction) => action.payload),
    switchMap(projectId => this.service$.get(projectId).pipe(
        map(taskLists => new actions.LoadSuccessAction(taskLists)),
        catchError((err) => of(new actions.LoadFailAction(JSON.stringify(err))))))
  );

  @Effect()
  addTaskLists$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.ADD),
    map((action: actions.AddAction) => action.payload),
    switchMap(taskList => this.service$.add(taskList).pipe(
        map(tl => new actions.AddSuccessAction(tl)),
        catchError((err) => of(new actions.AddFailAction(JSON.stringify(err))))
    ))
  );

  @Effect()
  updateTaskLists$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.UPDATE),
    map((action: actions.UpdateAction) => action.payload),
    switchMap((taskList) => this.service$.update(taskList).pipe(
        map(tl => new actions.UpdateSuccessAction(tl)),
        catchError((err) => of(new actions.UpdateFailAction(JSON.stringify(err))))
    ))
  );

  @Effect()
  delTaskLists$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.DELETE),
    map((action: actions.DeleteAction) => action.payload),
    switchMap((project) => this.service$.del(project).pipe(
        map(tl => new actions.DeleteSuccessAction(tl)),
        catchError((err) => of(new actions.DeleteFailAction(JSON.stringify(err))))
    ))
  );

  @Effect()
  swap$ = this.actions$.pipe(
    ofType(actions.ActionTypes.SWAP),
    map((action: actions.SwapAction) => action.payload),
    switchMap(({src, target}) => this.service$.swapOrder(src, target).pipe(
      map(taskLists => new actions.SwapSuccessAction(taskLists)),
      catchError(err => of(new actions.SwapFailAction(JSON.stringify(err))))
    ))
  );

  constructor(
    private actions$: Actions,
    private store$: Store<fromRoot.State>,
    private service$: TaskListService,
    private router: Router
  ) { }
}