import { Map, Record }                  from "immutable";
import { appName }                      from "../config";
import { all, select, take, call, put } from 'redux-saga/effects';

const ProjectRecord = Record({
    id: null,
    title: null,
    dueDate: null,
    createDate: null,
    completeDate: null,
    parentId: null,
    projectId: null,
    status: null,
    priority: null,
    children: null
});

const ReducerState = Record({
    projectsUsers: new Map({})
});

export const moduleName = 'projects';
const prefix = `${appName}/${moduleName}`;

//#region Actions
export const LOAD_PROJECT = `${prefix}/LOAD_PROJECT`;
export const LOAD_PROJECT_START = `${prefix}/LOAD_PROJECT_START`;
export const LOAD_PROJECT_SUCCESS = `${prefix}/LOAD_PROJECT_SUCCESS`;
export const LOAD_PROJECT_NOT_FOUND = `${prefix}/LOAD_PROJECT_NOT_FOUND`;
export const LOAD_PROJECT_ERROR = `${prefix}/LOAD_PROJECT_ERROR`;


export const UPDATE_PROJECT = `${prefix}/UPDATE_PROJECT`;
export const UPDATE_PROJECT_SUCCESS = `${prefix}/UPDATE_PROJECT_SUCCESS`;
export const CHECK_AND_LOAD_PROJECTS_FOR_PAGE = `${prefix}/CHECK_AND_LOAD_PROJECTS_FOR_PAGE`;
export const LOAD_PROJECTS_FOR_PAGE_START = `${prefix}/LOAD_PROJECTS_FOR_PAGE_START`;
export const LOAD_PROJECTS_FOR_PAGE_SUCCESS = `${prefix}/LOAD_PROJECTS_FOR_PAGE_SUCCESS`;
export const LOAD_PROJECTS_FOR_PAGE_NOT_FOUND = `${prefix}/LOAD_PROJECTS_FOR_PAGE_NOT_FOUND`;

export const CREATE_PROJECT_START = `${prefix}/CREATE_PROJECT_START`;
export const CREATE_PROJECT_SUCCESS = `${prefix}/CREATE_PROJECT_SUCCESS`;
export const CREATE_PROJECT_FAIL = `${prefix}/CREATE_PROJECT_FAIL`;

//#endregion


//#region Selectors

//#endregion

export default function reducer(state = new ReducerState(), action) {
    const { type, payload, response } = action;

    switch (type) {

    }

    return state;
}

//#region Actions Creators

//#endregion


//#region Sagas

//#endregion

export const saga = function* () {
    yield all([
    ]);
};