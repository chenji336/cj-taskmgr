import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { map, withLatestFrom, switchMap, catchError, tap } from 'rxjs/operators';

import { ProjectService } from '../services/project.service';
import * as fromRoot from '../reducers';
import * as actions from '../actions/project.action';
import * as listActions from '../actions/task-list.action';


@Injectable()
export class ProjectEffect {
    @Effect()
    loadProjects$: Observable<Action> = this.actions$.pipe(
        ofType(actions.ActionTypes.LOAD),
        map((action: actions.LoadAction) => {
            return  action.payload;
        }),
        withLatestFrom(this.store$.select(fromRoot.getAuthState)),
        switchMap(([_, auth]) =>
            this.service$.get(auth.userId).pipe(
                map(projects => {
                    return new actions.LoadSuccessAction(projects);
                }),
                catchError(err => of(new actions.LoadFailAction(JSON.stringify(err))))
            )
        )
    );

    @Effect()
    addProject$: Observable<Action> = this.actions$.pipe(
        ofType(actions.ActionTypes.ADD),
        map((action: actions.AddAction) => action.payload),
        withLatestFrom(this.store$.select(fromRoot.getAuthState)), // 会触发两次?答：在登录的时候已经触发了两次，所以后续不需要触发也可能获取到
        switchMap(([project, auth]) => {
            const added = { ...project, members: [`${auth.userId}`] };
            return this.service$.add(added).pipe(
                map(project => {
                    console.log('addProject$-project:', project);
                    return new actions.AddSuccessAction(project);
                }),
                catchError((err) => of(new actions.AddFailAction(JSON.stringify(err))))
            );
        })
    );

    @Effect()
    updateProject$: Observable<Action> = this.actions$.pipe(
        ofType(actions.ActionTypes.UPDATE),
        map((action: actions.UpdateAction) => action.payload),
        switchMap(project => this.service$.update(project).pipe(
            map(project => new actions.UpdateSuccessAction(project)),
            catchError((err) => of(new actions.UpdateFailAction(JSON.stringify(err))))
        ))
    );

    @Effect()
    delProjects$: Observable<Action> = this.actions$.pipe(
        ofType(actions.ActionTypes.DELETE),
        map((action: actions.DeleteAction) => action.payload),
        switchMap((project) => {
            console.log(project.id);
            return this.service$.del(project).pipe(
                map(project => new actions.DeleteSuccessAction(project)),
                catchError((err) => of(new actions.DeleteFailAction(JSON.stringify(err))))
            );
        })
    );

    @Effect()
    invite$: Observable<Action> = this.actions$.pipe(
        ofType(actions.ActionTypes.INVITE),
        map((action: actions.InviteAction) => action.payload),
        switchMap(({ projectId, members }) => {
            return this.service$.invite(projectId, members).pipe(
                map(project => (new actions.InviteSuccessAction(project))),
                catchError((err) => of(new actions.InviteFailAction(JSON.stringify(err))))
            );
        })
    );

    @Effect()
    selectProjects$ = this.actions$.pipe(
        ofType(actions.ActionTypes.SELECT_PROJECT),
        map((action: actions.SelectAction) => {
            return action.payload;
        }),
        tap((project) => {
            this.router.navigate([`/tasklists/${project.id}`]);
            // console.log('naviage-after-log'); // 说明在navigate之后，后面代码也会执行
        }),
        map(project => new listActions.LoadAction(project.id))  // 取代下面的
    );
    // 被上面map替换掉
   /*  @Effect() // 为啥要用dispatch:false.所以是写错了，应该true
    loadTaskLists$ = this.actions$.pipe(
        ofType(actions.ActionTypes.SELECT_PROJECT),
        map((action: actions.SelectAction) => {
            return action.payload;
        }),
        map(project => new listActions.LoadAction(project.id))  // 没有dispatch能触发？不能
    ); */

    constructor(
            private store$: Store < fromRoot.State >,
            private actions$: Actions,
            private service$: ProjectService,
            private router: Router
        ) {}
}