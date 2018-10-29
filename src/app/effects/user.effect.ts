import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as actions from '../actions/user.action';
import * as fromRoot from '../reducers';
import { UserService } from '../services/user.service';
@Injectable()
export class UserEffects {

  @Effect()
  loadUsers$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.LOAD),
    map((action: actions.LoadAction) => action.payload),
    switchMap(projectId => this.service$.gethUsersByProject(projectId).pipe(
        map(users => new actions.LoadSuccessAction(users)),
        catchError((err) => of(new actions.LoadFailAction(JSON.stringify(err))))))
  );

  @Effect()
  addUserProjectRef$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.ADD),
    map((action: actions.AddAction) => action.payload),
    switchMap(({user, projectId}) => this.service$.addProjectRef(user, projectId).pipe(
        map(u => new actions.AddSuccessAction(u)),
        catchError((err) => of(new actions.AddFailAction(JSON.stringify(err))))
    ))
  );

  @Effect()
  updateUserProjectRef$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.UPDATE),
    map((action: actions.UpdateAction) => action.payload),
    switchMap(project => this.service$.batchUpdateProjectRef(project).pipe(
        map(users => new actions.UpdateSuccessAction(users)),
        catchError((err) => of(new actions.UpdateFailAction(JSON.stringify(err))))
    ))
  );

  @Effect()
  delUserProjectRef$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.DELETE),
    map((action: actions.DeleteAction) => action.payload),
    switchMap(({user, projectId}) => this.service$.removeProjectRef(user, projectId).pipe(
        map(u => new actions.DeleteSuccessAction(u)),
        catchError((err) => of(new actions.DeleteFailAction(JSON.stringify(err))))
    ))
  );

  @Effect()
  search$ = this.actions$.pipe(
    ofType(actions.ActionTypes.SEARCH),
    map((action: actions.SearchAction) => action.payload),
    switchMap(str => this.service$.searchUsers(str).pipe(
      map(taskLists => new actions.SearchSuccessAction(taskLists)),
      catchError(err => of(new actions.SearchFailAction(JSON.stringify(err))))
    ))
  );

  constructor(
    private actions$: Actions,
    private store$: Store<fromRoot.State>,
    private service$: UserService,
  ) { }
}