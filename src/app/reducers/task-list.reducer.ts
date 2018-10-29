import * as _ from 'lodash';
import { createSelector } from 'reselect';
import * as prjActions from '../actions/project.action';
import * as actions from '../actions/task-list.action';
import { Project, TaskList } from './../domain';

export interface State {
     ids: string[];
     entities: {[id: string]: TaskList};
     selectedIds: string[];
}

export const initialState: State = {
    ids: [],
    entities: {},
    selectedIds: [],
};

const addTaskList = (state, action) => {
  const taskList = action.payload;
  if (state.entities[taskList.id]) {
    return state;
  }
  const newIds = [...state.ids, taskList.id];
  const newEntities = {...state.entities, [taskList.id]: taskList};
  return {...state, ids: newIds, entities: newEntities};
};

const updateTaskList = (state, action) => {
  const taskList = action.payload;
  const newEntities = {...state.entities, [taskList.id]: taskList};
  return {...state, entities: newEntities};
};

const delTaskList = (state, action) => {
  const taskList = action.payload;
  const newIds = state.ids.filter(id => id !== taskList.id);
  const newEntities = newIds.reduce((entities, id: string) => ({...entities, [id]: state.entities[id]}), {});
  const newSelectedIds = state.selectedIds.filter(id => id !== taskList.id);
  return {
    ids: newIds,
    entities: newEntities,
    selectedIds: newSelectedIds,
  };
};

const loadTaskLists = (state, action) => {
  const taskLists = action.payload;
  const incomingIds = taskLists.map(p => p.id);
  const newIds = _.difference(incomingIds, state.ids);
  const incomingEntities = _.chain(taskLists)
    .keyBy('id')
    .mapValues(o => o)
    .value();
  const newEntities = newIds.reduce((entities, id: string) => ({ ...entities, [id]: incomingEntities[id] }), {});
  return {
    ids: [...state.ids, ...newIds],
    entities: {...state.entities, ...newEntities},
    selectedIds: incomingIds
  };
};

const swapTaskLists = (state, action) => {
  const taskList = <TaskList[]>action.payload;
  const updatedEntities = _.chain(taskList)
    .mapValues(o => o)
    .value();
  const newEntities = {...state.entities, ...updatedEntities};
  return {
    ...state,
    entities: newEntities
  };
};

const selectPrj = (state, action) => {
  const selected = <Project>action.payload;
  const selectedIds = state.ids.filter(id => state.entities[id].projectId === selected.id);
  return {
    ...state,
    selectedIds: selectedIds
  };
};

const delListsByPrj = (state, action) => {
  const project = <Project>action.payload;
  const taskListIds = project.taskLists;
  const remainingIds = _.difference(state.ids, taskListIds);
  const remainingEntities = remainingIds.reduce((entities, id) => ({...entities, [id]: state.entitites}), {});
  return {
    ids: [...remainingIds],
    entities: remainingEntities,
    selectedIds: []
  };
};

export function reducer(state = initialState, action: actions.Actions ): State {
  switch (action.type) {
    case actions.ActionTypes.ADD_SUCCESS: {
      return addTaskList(state, action);
    }
    case actions.ActionTypes.DELETE_SUCCESS: {
      return delTaskList(state, action);
    }
    case actions.ActionTypes.UPDATE_SUCCESS: {
      return updateTaskList(state, action);
    }
    case actions.ActionTypes.LOAD_SUCCESS: {
      return loadTaskLists(state, action);
    }
    case actions.ActionTypes.SWAP_SUCCESS: {
      return swapTaskLists(state, action);
    }

    // 会不会同时也进入project.reducer的select_project了
    case prjActions.ActionTypes.SELECT_PROJECT: {
      return selectPrj(state, action);
    }

    case prjActions.ActionTypes.DELETE_SUCCESS: {
      return delListsByPrj(state, action);
    }
    default: {
      return state;
    }
  }
}

export const getIds = (state: State) => state.ids;
export const getEntities = (state: State) => state.entities;
export const getSelectedIds = (state: State) => state.selectedIds;

export const getSelected = createSelector(getSelectedIds, getEntities, (selectedIds, entities) => {
  return selectedIds.map(id => entities[id]);
});
