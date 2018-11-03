import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as actions from '../actions/task.action';
import * as fromRoot from '../reducers';
import { TaskService } from '../services/task.service';

@Injectable()
export class TaskEffects {

    @Effect()
    loadTasks$: Observable<Action> = this.actions$.pipe( 
        ofType(actions.ActionTypes.LOAD),
        map((action: actions.LoadAction) => action.payload),
        switchMap(taskList => {
            return this.service$.getByLists(taskList).pipe(
                map(tasks => new actions.LoadSuccessAction(tasks)),
                catchError((err) => of(new actions.LoadFailAction(JSON.stringify(err)))));
        })
    );

    @Effect()
    addTasks$: Observable<Action> = this.actions$.pipe(
        ofType(actions.ActionTypes.ADD),
        map((action: actions.AddAction) => action.payload),
        switchMap(task => this.service$.add(task).pipe(
            map(t => new actions.AddSuccessAction(t)),
            catchError((err) => of(new actions.AddFailAction(JSON.stringify(err))))
        ))
    );

    @Effect()
    updateTasks$: Observable<Action> = this.actions$.pipe(
        ofType(actions.ActionTypes.UPDATE),
        map((action: actions.UpdateAction) => action.payload),
        switchMap((task) => this.service$.update(task).pipe(
            map(t => new actions.UpdateSuccessAction(t)),
            catchError((err) => of(new actions.UpdateFailAction(JSON.stringify(err))))
        ))
    );

    @Effect()
    delTasks$: Observable<Action> = this.actions$.pipe(
        ofType(actions.ActionTypes.DELETE),
        map((action: actions.DeleteAction) => action.payload),
        switchMap((task) => this.service$.del(task).pipe(
            map(t => new actions.DeleteSuccessAction(t)),
            catchError((err) => of(new actions.DeleteFailAction(JSON.stringify(err))))
        ))
    );

    @Effect()
    completeTasks$: Observable<Action> = this.actions$.pipe(
        ofType(actions.ActionTypes.COMPLETE),
        map((action: actions.CompleteAction) => action.payload),
        switchMap((task) => this.service$.complete(task).pipe(
            map(t => new actions.CompleteSuccessAction(t)),
            catchError((err) => of(new actions.CompleteFailAction(JSON.stringify(err))))
        ))
    );

    @Effect()
    move = this.actions$.pipe(
        ofType(actions.ActionTypes.MOVE),
        map((action: actions.MoveAction) => action.payload),
        switchMap(({ taskId, taskListId }) => this.service$.move(taskId, taskListId).pipe(
            map(task => new actions.MoveSuccessAction(task)),
            catchError(err => of(new actions.MoveFailAction(JSON.stringify(err))))
        ))
    );

    @Effect()
    moveAll = this.actions$.pipe(
        ofType(actions.ActionTypes.MOVE_ALL),
        map((action: actions.MoveAllAction) => action.payload),
        switchMap(({ srcListId, targetListId }) => this.service$.moveAll(srcListId, targetListId).pipe(
            map(tasks => new actions.MoveAllSuccessAction(tasks)),
            catchError(err => of(new actions.MoveAllFailAction(JSON.stringify(err))))
        ))
    );

    constructor(
        private actions$: Actions,
        private store$: Store<fromRoot.State>,
        private service$: TaskService,
    ) { }
}