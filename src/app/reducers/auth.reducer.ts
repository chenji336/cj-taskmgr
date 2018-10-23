import { Auth } from '../domain/auth.model';
import * as actions from '../actions/auth.action';

export const initialState: Auth = {}; // 有些地方会定义interface State{quote: Quote},然后 initialState: State

export function reducer(state = initialState, action: actions.Actions) {
    const actionTypes = actions.ActionTypes;
    switch (action.type) {
        case actionTypes.LOGIN_SUCCESS:
        case actionTypes.REGISTER_SUCCESS:
            return {...state, ...<Auth>action.payload};
        case actionTypes.LOGIN_FAIL:
        case actionTypes.REGISTER_FAIL:
            return initialState;
        default: 
            return state;
    }
}

// 不一定要定义getAuth，所以这里省略掉了