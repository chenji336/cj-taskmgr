import * as _ from 'lodash';
import { createSelector } from 'reselect';
import * as prjActions from '../actions/project.action';
import * as actions from '../actions/task.action';
import { Project, Task } from './../domain';

export interface State {
     ids: string[];
     entities: {[id: string]: Task};
}

export const initialState: State = {
    ids: [],
    entities: {},
};

const addTask = (state, action) => {
  const taskList = action.payload;
  if (state.entities[taskList.id]) {
    return state;
  }
  const newIds = [...state.ids, taskList.id];
  const newEntities = {...state.entities, [taskList.id]: taskList};
  return {...state, ids: newIds, entities: newEntities};
};

const updateTask = (state, action) => {
  const taskList = action.payload;
  const newEntities = {...state.entities, [taskList.id]: taskList};
  return {...state, entities: newEntities};
};

const delTask = (state, action) => {
  const taskList = action.payload;
  const newIds = state.iods.filter(id => id !== taskList.id);
  const newEntities = newIds.reduce((entities, id: string) => ({...entities, [id]: state.entities[id]}), {});
  return {
    ids: newIds,
    entities: newEntities,
  };
};

const loadTasks = (state, action) => {
  const tasks = action.payload;
  const incomingIds = tasks.map(p => p.id);
  const newIds = _.difference(incomingIds, state.ids);
  const incomingEntities = _.chain(tasks)
    .keyBy('id')
    .mapValues(o => o)
    .value();
  const newEntities = newIds.reduce((entities, id: string) => ({ ...entities, [id]: incomingEntities[id] }), {});
  return {
    ids: [...state.ids, ...newIds],
    entities: {...state.entities, ...newEntities},
  };
};

const moveAllTasks = (state, action) => {
  const tasks = <Task[]>action.payload;
  const updatedEntities = tasks.reduce((entities, task) => ({...entities, [task.id]: task}), {});
  return {
    ...state,
    entities: {...state.entities, ...updatedEntities}
  };
};

const delByPrj = (state, action) => {
  const project = <Project>action.payload;
  const taskListIds = project.taskLists;
  const remainingIds = state.ids.filter(id => taskListIds.indexOf(state.entities[id].taskListId) === -1);
  const remainingEntities = remainingIds.reduce((entities, id) => ({...entities, [id]: state.entitites}), {});
  return {
    ids: [...remainingIds],
    entities: remainingEntities,
  };
};

export function reducer(state = initialState, action: actions.Actions ): State {
  switch (action.type) {
    case actions.ActionTypes.ADD_SUCCESS: {
      return addTask(state, action);
    }
    case actions.ActionTypes.DELETE_SUCCESS: {
      return delTask(state, action);
    }
    case actions.ActionTypes.COMPLETE_SUCCESS:
    case actions.ActionTypes.MOVE_SUCCESS:
    case actions.ActionTypes.UPDATE_SUCCESS: {
      return updateTask(state, action);
    }
    case actions.ActionTypes.LOAD_SUCCESS: {
      return loadTasks(state, action);
    }
    case actions.ActionTypes.MOVE_ALL_SUCCESS: {
      return moveAllTasks(state, action);
    }
    case prjActions.ActionTypes.DELETE_SUCCESS: {
      return delByPrj(state, action);
    }
    default: {
      return state;
    }
  }
}

export const getIds = (state: State) => state.ids;
export const getEntities = (state: State) => state.entities;

export const getTasks = createSelector(getIds, getEntities, (ids, entities) => {
  return ids.map(id => entities[id]);
});
