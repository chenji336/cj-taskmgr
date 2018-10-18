import { ActionReducer, combineReducers, compose, StoreModule } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import * as fromQuote from './quote.reducer';
import { NgModule } from '@angular/core';
import { environment } from '../../environments/environment';


export interface State {
    quote: fromQuote.State
}

const initialState: State = {
    quote: fromQuote.initialState
};

const reducers = {
    quote: fromQuote.reducers
};

const productionReducers: ActionReducer<State> = combineReducers(reducers);
const developmentReducers: ActionReducer<State> = compose(storeFreeze, combineReducers)(reducers);

export function reducer(state = initialState, action: any): State {
    return environment.production ? productionReducers(state, action) : developmentReducers(state, action);
}

NgModule({
    imports: [
        StoreModule.forRoot(reducer),
        StoreRouterConnectingModule.forRoot(),
        StoreDevtoolsModule.instrument()
    ]
});

export class AppStoreModule {};


