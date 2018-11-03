import { Project } from "../domain";
import * as actions from '../actions/project.action';
import * as _ from 'lodash';
import { createSelector } from "reselect";

// reducer返回值不一定是state类型，按照最后的getXxxx来进行返回
// 没明白State为啥按照这种来定义？而不是直接Project，后续只要操作Project就行？（到时候看视频了解原因）
export interface State {
    ids: any[],
    entities: { [id: string]: Project },
    selectedId: string | null
};

export const initialState: State = {
    ids: [],
    entities: {},
    selectedId: null
};

// state的值已经在store$中了，如果之前是有数据的，那么state就会有数据
const addProject = (state, action) => {
    const project = action.payload;
    if (state.entities[project.id]) {
        return state;
    }
    const newIds = [...state.ids, project.id];
    const newEntities = { ...state.entities, [project.id]: project };
    return { ...state, ids: newIds, entities: newEntities };
}

const updateProject = (state, action) => {
    const project = action.payload;
    const newEntities = { ...state.entities, [project.id]: project };
    return { ...state, entities: newEntities };
}

const delProject = (state, action) => {
    const project = action.payload;
    const newIds = state.ids.filter(id => id !== project.id);
    const newEntities = newIds.reduce((entities, id: string) => ({ ...entities, [id]: state.entities[id] }), {});
    return { ids: newIds, entities: newEntities, selectedId: null };
}

const loadProject = (state, action) => {
    const projects = action.payload;
    const incomingIds = projects.map(p => p.id);
    const newIds = _.difference(incomingIds, state.ids);
    const incomingEntities = _
        .chain(projects)
        .keyBy('id')
        .mapValues(o => o) // 感觉这个没起啥作用
        .value(); // chain之后需要value获取值
    const newEntities = newIds.reduce((entities, id: string) => ({ ...entities, [id]: incomingEntities[id] }), {});
    return {
        ids: [...state.ids, ...newIds],
        entities: { ...state.entities, ...newEntities },
        selectedId: null
    };
}

export function reducer(state = initialState, action: actions.Actions): State {
    switch (action.type) {
        case actions.ActionTypes.ADD_SUCCESS:
            return addProject(state, action);
        case actions.ActionTypes.INVITE_SUCCESS:
        case actions.ActionTypes.UPDATE_SUCCESS:
            return updateProject(state, action);
        case actions.ActionTypes.DELETE_SUCCESS:
            return delProject(state, action);
        case actions.ActionTypes.LOAD_SUCCESS:
            return loadProject(state, action);
        case actions.ActionTypes.SELECT_PROJECT:
            const select_actions = action as actions.SelectAction;
            return { ...state, selectedId: select_actions.payload.id };
        default:
            return state;
    }
}

export const getIds = (state: State) => state.ids;
export const getEntities = (state: State) => state.entities;
export const getSelectedId = (state: State) => state.selectedId;

// 返回的值按照这里来决定（所以返回的不一定是state类型的）
export const getAll = createSelector(getIds, getEntities, (ids, entities) => ids.map(id => entities[id]));