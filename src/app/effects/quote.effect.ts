import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';

import { QuoteService } from '../services/quote.service';
import * as actions from '../actions/quote.action';
import { switchMap, map, catchError } from 'rxjs/operators';


@Injectable()
export class QuoteEffect {

    @Effect()
    quote$: Observable<Action> = this.actions$.pipe(
        ofType(actions.ActionTypes.LOAD), // 跟saga一样，会先进入reducers，再进入这里（把这想像成执行一个异步函数）
        switchMap(_ => {
            // console.log('进入到了quote-effect,who trigger me?');
            return this.service.getQuote().pipe(
                map(data => new actions.LoadSuccessAction(data)), // Effect中默认回调用dispatch进行发送了
                catchError(err => of(new actions.LoadFailAction(JSON.stringify(err))))
            )
        })
    )

    constructor(
        private actions$: Actions,
        private service: QuoteService
    ) { }
}