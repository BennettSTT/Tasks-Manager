import { Map, Record }                  from "immutable";
import { appName }                      from "../config";
import { arrToMap, mapToArr }           from "../utils";
import { all, select, take, call, put } from 'redux-saga/effects';
import { fetchApi, refreshToken }       from "../api";
import { getToken, checkToken }         from "../token";
import { createSelector }               from "reselect";
import { moduleName as authModule }     from './auth';
import { push }                         from 'react-router-redux';

const ProjectRecord = Record({
    id: null,
    title: null,
    description: null,
    inArchive: null,
    openTasksCount: null
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
const entitiesGetter = (state, { match: { params: { login } } }) => state[moduleName].getIn(['projectsUsers', login, 'entities']);
const projectTitleGetter = (state, { match: { params: { projectTitle } } }) => projectTitle;
export const projectSelectorFactory = () => createSelector(entitiesGetter, projectTitleGetter, (entities, projectTitle) =>
  entities ? mapToArr(entities).filter(p => p.get('title') === projectTitle)[0] : undefined
);
//#endregion

export default function reducer(state = new ReducerState(), action) {
    const { type, payload, response } = action;

    switch (type) {
        case LOAD_PROJECTS_FOR_PAGE_START:
            return state
                .setIn(['projectsUsers', payload.login, 'loaded'], false)
                .setIn(['projectsUsers', payload.login, 'loading'], true);

        case LOAD_PROJECTS_FOR_PAGE_SUCCESS:
            return state
                .setIn(['projectsUsers', payload.login, 'totalItemsCount'], response.totalItemsCount)
                .setIn(['projectsUsers', payload.login, 'pageSize'], response.pageSize)
                .setIn(['projectsUsers', payload.login, 'totalPagesCount'], response.totalPagesCount)
                .setIn(['projectsUsers', payload.login, 'loaded'], true)
                .setIn(['projectsUsers', payload.login, 'loading'], false)
                .mergeIn(['projectsUsers', payload.login, 'entities'], arrToMap(response.items, ProjectRecord));

        case LOAD_PROJECTS_FOR_PAGE_NOT_FOUND:
            return state
                .setIn(['projectsUsers', payload.login, 'loaded'], true)
                .setIn(['projectsUsers', payload.login, 'loading'], false);

        case UPDATE_PROJECT_SUCCESS:
            return state
                .updateIn(['projectsUsers', payload.login, 'entities'], entities =>
                    entities.update(response.project.id, project => project.merge(response.project))
                );

        case CREATE_PROJECT_SUCCESS:
            return state
                .updateIn(['projectsUsers', payload.login, 'entities'], entities => {
                        if (entities === undefined) entities = new Map({});
                        return entities.set(response.project.id, new ProjectRecord(response.project));
                    }
                );

        case LOAD_PROJECT_SUCCESS:
            return state
                .updateIn(['projectsUsers', payload.login, 'entities'], entities => {
                        if (entities === undefined) entities = new Map({});
                        return entities.set(response.project.id, new ProjectRecord(response.project));
                    }
                );
    }

    return state;
}

//#region Actions Creators
export function checkAndLoadProjectsForPage(login, page, inArchive) {
    return {
        type: CHECK_AND_LOAD_PROJECTS_FOR_PAGE,
        payload: { login, page, inArchive }
    };
}

export function checkAndLoadProject(login, projectTitle) {
    return {
        type: LOAD_PROJECT,
        payload: {
            login,
            projectTitle
        }
    };
}

export function updateProject(project) {
    return {
        type: UPDATE_PROJECT,
        payload: { project }
    };
}

export function createProject(title, description) {
    return {
        type: CREATE_PROJECT_START,
        payload: {
            project: {
                title, description
            }
        }
    };
}

//#endregion


//#region Sagas
export function* checkAndLoadProjectsForPageSaga() {
    while (true) {

        const { payload: { login, /*page,*/ inArchive } } = yield take(CHECK_AND_LOAD_PROJECTS_FOR_PAGE);
        const { [moduleName]: { projectsUsers } } = yield select();

        const pageLoading = yield call([projectsUsers, projectsUsers.getIn], [login, 'loading']);
        const pageLoaded = yield call([projectsUsers, projectsUsers.getIn], [login, 'loaded']);
        // const pageIds = yield call([projectsUsers, projectsUsers.getIn], [login, 'pagination', inArchive, page, 'ids']);

        if (pageLoading /*|| pageIds */ || pageLoaded) {
            continue;
        }

        yield put({
            type: LOAD_PROJECTS_FOR_PAGE_START,
            payload: { /*page*/ login, inArchive }
        });

        try {
            const check = yield call(checkToken);
            if (check) yield call(refreshToken);

            const headers = new Headers();
            const { accessToken } = yield call(getToken);

            yield call([headers, headers.append], 'Content-Type', 'application/json');
            yield call([headers, headers.append], 'Authorization', `Bearer ${accessToken}`);

            const res = yield call(fetchApi, `/api/Projects/${login}/`, {
                method: 'GET', headers: headers
            });

            if (res.status === 404) {
                yield put({
                    type: LOAD_PROJECTS_FOR_PAGE_NOT_FOUND,
                    payload: { login, /*page,*/ inArchive }
                });
                continue;
            }

            if (!res.ok) {
                const message = yield call([res, res.text]);
                throw new Error(message);
            }

            const body = yield call([res, res.json]);

            yield put({
                type: LOAD_PROJECTS_FOR_PAGE_SUCCESS,
                payload: { login, /*page,*/ inArchive },
                response: body
            });

        } catch (e) {
            console.error(e);
            debugger;
        }
    }
}

export function* updateProjectSaga() {
    while (true) {
        try {
            const { payload: { project: { title, description, inArchive, id } } } = yield take(UPDATE_PROJECT);

            const check = yield call(checkToken);
            if (check) yield call(refreshToken);

            const { accessToken } = yield call(getToken);
            const headers = new Headers();

            yield call([headers, headers.append], 'Content-Type', 'application/json');
            yield call([headers, headers.append], 'Authorization', `Bearer ${accessToken}`);

            const response = yield call(fetchApi, `/api/Projects/${id}`, {
                method: 'PUT', headers: headers, body: JSON.stringify({ title, description, inArchive })
            });

            if (!response.ok) {
                const message = yield call([response, response.text]);
                throw new Error(message);
            }

            const body = yield call([response, response.json]);
            const { [authModule]: { user: { login } } } = yield select();

            yield put({
                type: UPDATE_PROJECT_SUCCESS,
                payload: { login },
                response: { project: body }
            });

            yield put(push(`/${login}/${body.title}`))

        } catch (error) {
            debugger;
            console.error(error);
        }
    }
}

export function* createProjectSaga() {
    while (true) {
        const action = yield take(CREATE_PROJECT_START);
        const { [authModule]: { user: { login } } } = yield select();

        try {
            const check = yield call(checkToken);
            if (check) yield call(refreshToken);

            const { accessToken } = yield call(getToken);
            const headers = new Headers();

            yield call([headers, headers.append], 'Content-Type', 'application/json');
            yield call([headers, headers.append], 'Authorization', `Bearer ${accessToken}`);

            const response = yield call(fetchApi, '/api/Projects/new', {
                method: 'POST', headers: headers, body: JSON.stringify(action.payload.project)
            });

            if (!response.ok) {
                const message = yield call([response, response.text]);
                throw new Error(message);
            }

            const project = yield call([response, response.json]);

            yield put({
                type: CREATE_PROJECT_SUCCESS,
                payload: { login },
                response: { project }
            });

            yield put(push(`/${login}/${project.title}`));
        } catch (error) {
            // TODO: Сделать реакцию на CREATE_PROJECT_FAIL
            yield put({
                type: CREATE_PROJECT_FAIL,
                payload: { login }
            });
            console.error(error);
            debugger;
        }
    }
}

export function* checkAndLoadProjectSaga() {
    while (true) {
        const { payload: { login, projectTitle } } = yield take(LOAD_PROJECT);

        try {
            const { [moduleName]: { projectsUsers } } = yield select();

            // Ищем проект в entities
            // Если не находим - идем дальше
            const entities = yield call([projectsUsers, projectsUsers.getIn], [login, 'entities']);
            if (entities) {
                const proj = mapToArr(entities).filter(p => p.get('title') === projectTitle);
                if (proj !== undefined || proj.size > 0) continue;
            }

            yield put({
                type: LOAD_PROJECT_START,
                payload: { login, projectTitle }
            });

            const check = yield call(checkToken);
            if (check) yield call(refreshToken);

            const { accessToken } = yield call(getToken);
            const headers = new Headers();

            yield call([headers, headers.append], 'Content-Type', 'application/json');
            yield call([headers, headers.append], 'Authorization', `Bearer ${accessToken}`);

            const response = yield call(fetchApi, `/api/Projects/${login}/${projectTitle}`, {
                method: 'GET',
                headers: headers
            });

            if (response.status === 404) {
                yield put({
                    type: LOAD_PROJECT_NOT_FOUND,
                    payload: { login, projectTitle }
                });
                continue;
            }

            if (!response.ok) {
                const message = yield call([response, response.text]);
                throw new Error(message);
            }

            const body = yield call([response, response.json]);

            yield put({
                type: LOAD_PROJECT_SUCCESS,
                payload: {
                    login, projectTitle
                },
                response: { project: body }
            });
        } catch (error) {
            yield put({
                type: LOAD_PROJECT_ERROR,
                payload: { login, projectTitle },
                error
            });
        }
    }
}

//#endregion

export const saga = function* () {
    yield all([
        checkAndLoadProjectsForPageSaga(),
        checkAndLoadProjectSaga(),
        updateProjectSaga(),
        createProjectSaga()
    ]);
};