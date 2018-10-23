import { type } from '../utils/type.util';
import { Action } from '@ngrx/store';
import { Auth } from '../domain/auth.model';
import { User } from '../domain';

export const ActionTypes = {
    LOGIN: type('[auth] Login'),
    LOGIN_SUCCESS: type('[auth] Login Success'),
    LOGIN_FAIL: type('[auth] Login Fail'),
    REGISTER: type('[auth] Register'),
    REGISTER_SUCCESS: type('[auth] Register Success'),
    REGISTER_FAIL: type('[auth] Register Fail'),
    LOGOUT: type('[auth] Logout')
};


export class LoginAction implements Action {
    type = ActionTypes.LOGIN;

    constructor(public payload: {email: string, password: string}){}
}

export class LoginSuccessAction implements Action {
    type = ActionTypes.LOGIN_SUCCESS;

    constructor(public payload: Auth) {}
}

export class LoginFailAction implements Action {
    type = ActionTypes.LOGIN_FAIL;

    constructor(public payload: string) {}
}

export class RegisterAction implements Action {
    type = ActionTypes.REGISTER;

    constructor(public payload: User){}
}

export class RegisterSuccessAction implements Action {
    type = ActionTypes.REGISTER_SUCCESS;

    constructor(public payload: Auth) {}
}

export class RegisterFailAction implements Action {
    type = ActionTypes.REGISTER_FAIL;

    constructor(public payload: string) {}
}

export class LogOutAction implements Action {
    type = ActionTypes.LOGOUT;

    constructor(public payload: null) {}
}

export type Actions = LoginAction
    | LoginSuccessAction
    | LoginFailAction
    | RegisterAction
    | RegisterSuccessAction
    | RegisterFailAction
    | LogOutAction;