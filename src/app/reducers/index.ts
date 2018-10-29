import { StoreModule, MetaReducer, ActionReducer } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';
import { StoreRouterConnectingModule, routerReducer } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { createSelector } from 'reselect';
import { NgModule } from '@angular/core';

import { environment } from '../../environments/environment';
import { Auth } from '../domain/auth.model';
import { AppEffectsModule } from '../effects';
import * as fromQuote from './quote.reducer';
import * as fromAuth from './auth.reducer';
import * as fromProject from './project.reducer';
import * as fromTaskList from './task-list.reducer';
import * as fromTask from './task.reducer';
import * as fromUser from './user.reducer';


export interface State {
    quote: fromQuote.State,
    auth: Auth,
    projects: fromProject.State,
    taskLists: fromTaskList.State,
    tasks: fromTask.State,
    users: fromUser.State,
}

const initialState: State = {
    quote: fromQuote.initialState,
    auth: fromAuth.initialState,
    projects: fromProject.initialState,
    taskLists: fromTaskList.initialState,
    tasks: fromTask.initialState,
    users: fromUser.initialState,
};

const reducers = {
    quote: fromQuote.reducer,
    auth: fromAuth.reducer,
    projects: fromProject.reducer,
    taskLists: fromTaskList.reducer,
    tasks: fromTask.reducer,
    users: fromUser.reducer,
};

// 测试环境嵌入这些插件，storeFreeze也是
export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
    return function(state: State, action: any): State {
        console.log('state', state);
        console.log('action', action);
        return reducer(state, action);
    }
} 

// 注释下面是因为最新版本的ngrx只要StoreModule.forRoot(reducers)即可，下面反而执行不了
/* const productionReducers: ActionReducer<State> = combineReducers(reducers);
const developmentReducers: ActionReducer<State> = compose(storeFreeze, combineReducers)(reducers) as ActionReducer<State, Action>;
export function reducer(state = initialState, action: any): State {
    return environment.production ? productionReducers(state, action) : developmentReducers(state, action);
} */
// 是否可以用下面的替换上面的了？后续做的时候解答
// 解答： 跟老版本是等价的。freeze其实就是不让state进行属性的扩展，在该commit的login.component.ts中可以看到
export const metaReducers: MetaReducer<State>[] = !environment.production ? [logger, storeFreeze]: [];


export const getQuoteState = (state: State) => {
    console.log('getQuoteState-state:', state);
    return state.quote;
};
export const getAuthState = (state: State) => state.auth;  // 这里直接获取的就是auth的值，不需要auth.auth这样
export const getProjectsState = (state: State) => state.projects;
export const getTaskListState = (state: State) => state.taskLists;
export const getTasksState = (state: State) => state.tasks;
export const getUsersState = (state: State) => state.users;

// 如果成功了可以测试一下@ngrx/store的createSelector是不是也是一样的效果
export const getQuote = createSelector(getQuoteState, fromQuote.getQuote);
export const getProjects = createSelector(getProjectsState, fromProject.getAll);
export const getTaskLists = createSelector(getTaskListState, fromTaskList.getSelected);
export const getTasks = createSelector(getTasksState, fromTask.getTasks);
export const getUsers = createSelector(getUsersState, fromUser.getUsers);

export const getUserEntities = createSelector(getUsersState, fromUser.getEntities);
export const getTasksWithOwners = createSelector(getTasks, getUserEntities, (tasks, userEntities) => {
    return tasks.map(task => ({
        ...task,
        owner: userEntities[task.ownerId],
        participants: task.participantIds.map(id => userEntities[id])
    }))
});
export const getTasksByLists = createSelector(getTaskLists, getTasksWithOwners, (lists, tasks) => {
    return lists.map(list => ({
        ...list,
        tasks: tasks.filter(task => task.taskListId === list.id)
    }))
});
export const getProjectUsers = (projectId: string) => createSelector(
    getProjectsState, 
    fromUser.getEntities, 
    (state, userEntities) => {
        return state.entities[projectId].memebers.map(id => userEntities[id]);
    }
);

@NgModule({
    imports: [
        StoreModule.forRoot(reducers, { metaReducers }),
        StoreRouterConnectingModule.forRoot({
            stateKey: 'router' // name of reducer key
        }),
        StoreDevtoolsModule.instrument({
            maxAge: 25, //Retain last 25 states
            logOnly: environment.production // Restrict extension to log-only mode
        }),
        AppEffectsModule, // 放在reducer里面更合适
    ]
})
export class AppStoreModule {};


