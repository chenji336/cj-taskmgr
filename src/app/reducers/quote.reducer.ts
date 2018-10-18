import * as actions from '../actions/quote.action';
import { Quote } from '../domain/quote.model';

export interface State {
    quote: Quote
}

export const initialState: State = {
    quote: {
        cn: '慧妍',
        en: 'Aliquam erat volutpat.',
        pic: '/assets/img/quotes/1.jpg'
    }
};

export function reducers(state: State = initialState, action: {type: string, payload: string}) {
    switch (action.type) {
        case actions.QUOTE_SUCCESS: 
            return {...state, quote: action.payload};
        case actions.QUOTE_FAILED:
        default:
            return state;
    }
}

