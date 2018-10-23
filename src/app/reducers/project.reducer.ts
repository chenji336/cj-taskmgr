import { Project } from "../domain";
import * as actions from '../actions/project.action';
import * as _ from 'lodash';
import { createSelector } from "reselect";

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
    const newEntities = newIds.reduce((entities, id: string) => ({...entities, [id]: incomingEntities[id]}), {});
    return {
        ids: [...state.ids, ...newIds],
        entities: {...state.entities, ...newEntities},
        selectedId: null
    };
}

export function reducer(state = initialState, action: actions.Actions): State {
    switch (action.type) {
        case actions.ActionTypes.ADD_SUCCESS:
            return addProject(state, action);
        case actions.ActionTypes.UPDATE_SUCCESS:
            return updateProject(state, action);
        case actions.ActionTypes.DELETE_SUCCESS:
            return delProject(state, action);
        case actions.ActionTypes.LOAD_SUCCESS:
            return loadProject(state, action);
        case actions.ActionTypes.SELECT_PROJECT:
            return { ...state, selectedId: (<Project>action.payload).id };
        default:
            return state;
    }
}

export const getIds = (state: State) => state.ids;
export const getEntities = (state: State) => state.entities;
export const getSelectedId = (state: State) => state.selectedId;

export const getAll = createSelector(getIds, getEntities, (ids, entities) => ids.map(id => entities[id]));