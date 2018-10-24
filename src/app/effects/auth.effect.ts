
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, switchMap, catchError, tap } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';
import * as actions from '../actions/auth.action';
import { User } from '../domain';

@Injectable()
export class AuthEffects {
    @Effect()
    login$: Observable<Action> = this.actions$.pipe(
        ofType(actions.ActionTypes.LOGIN),
        map((action: actions.LoginAction) => action.payload),
        switchMap(({ email, password }) =>
            this.service$.login(email, password).pipe(
                map(auth => new actions.LoginSuccessAction(auth)),
                catchError(err => of(new actions.LoginFailAction(JSON.stringify(err))))
            ))
    );

    @Effect()
    register$: Observable<Action> = this.actions$.pipe(
        ofType(actions.ActionTypes.REGISTER),
        map((action: actions.RegisterAction) => action.payload), // 这边payload跟action定义的类型是不是对不上？为啥没报错？
        switchMap((user: User) =>
            this.service$.register(user).pipe(
                map(auth => new actions.RegisterSuccessAction(auth)),
                catchError(err => of(new actions.RegisterFailAction(JSON.stringify(err))))
            ))
    );

    @Effect({dispatch: false})
    logout$ = this.actions$.pipe(
        ofType(actions.ActionTypes.LOGOUT),
        tap(() => {
            this.router.navigate(['/'])
        })
    );

    @Effect({dispatch: false})
    loginAndNavigate$ = this.actions$.pipe(
        ofType(actions.ActionTypes.LOGIN_SUCCESS),
        tap(() => {
            this.router.navigate(['/projects'])
        })
    );

    @Effect({dispatch: false})
    registerAndNavigate$  = this.actions$.pipe(
        ofType(actions.ActionTypes.REGISTER_SUCCESS),
        tap(() => {
            this.router.navigate(['/projects'])
        })
    );

    constructor(
        private actions$: Actions,
        private service$: AuthService,
        private router: Router
    ) { }
}