import { Map, OrderedMap, Record }                    from "immutable";
import { appName }                                    from "../config";
import { arrToMap }                                   from "../utils";
import { all, select, take, call, put }               from 'redux-saga/effects';
import { fetchApi, refreshToken }                     from "../api";
import { getToken, setToken, clearToken, checkToken } from "../token";
import { createSelector }                             from "reselect";

const ProjectRecord = Record({
    id: null,
    title: null,
    description: null,
    inArchive: null,
    openTasksCount: null,
    loaded: false,
    loading: false
});

const ReducerState = Record({
    projectsUsers: new Map({})
});

export const moduleName = 'projects';
const prefix = `${appName}/${moduleName}`;

//#region Actions
export const UPDATE_PROJECT = `${prefix}/UPDATE_PROJECT`;

export const CHECK_AND_LOAD_PROJECTS_FOR_PAGE = `${prefix}/CHECK_AND_LOAD_PROJECTS_FOR_PAGE`;
export const LOAD_PROJECTS_FOR_PAGE_START = `${prefix}/LOAD_PROJECTS_FOR_PAGE_START`;
export const LOAD_PROJECTS_FOR_PAGE_SUCCESS = `${prefix}/LOAD_PROJECTS_FOR_PAGE_SUCCESS`;
export const LOAD_PROJECTS_FOR_PAGE_NOT_FOUND = `${prefix}/LOAD_PROJECTS_FOR_PAGE_NOT_FOUND`;

export const LOAD_PROJECTS_FOR_PAGE_ERROR = `${prefix}/LOAD_PROJECTS_FOR_PAGE_ERROR`;
export const LOAD_PROJECTS_FOR_PAGE = `${prefix}/LOAD_PROJECTS_FOR_PAGE`;
//#endregion

//#region Selectors
const projectsGetter = (state, props) => state[moduleName].getIn(['projectsUsers', props.login, 'entities']);
const idGetter = (state, props) => props.id;
export const projectSelectorFactory = () => createSelector(projectsGetter, idGetter, (projects, id) => {
    return projects.get(id);
});
//#endregion

export default function reducer(state = new ReducerState(), action) {
    const { type, payload, response } = action;

    switch (type) {
        case LOAD_PROJECTS_FOR_PAGE_START:
            return state
                .setIn(['projectsUsers', payload.login, 'pagination', payload.inArchive, payload.page, 'loaded'], false)
                .setIn(['projectsUsers', payload.login, 'pagination', payload.inArchive, payload.page, 'loading'], true)
                .setIn(['projectsUsers', payload.login, 'loaded'], false)
                .setIn(['projectsUsers', payload.login, 'loading'], true);

        case LOAD_PROJECTS_FOR_PAGE_SUCCESS:
            return state
                .setIn(['projectsUsers', payload.login, 'totalItemsCount'], response.totalItemsCount)
                .setIn(['projectsUsers', payload.login, 'pageSize'], response.pageSize)
                .setIn(['projectsUsers', payload.login, 'totalPagesCount'], response.totalPagesCount)
                .setIn(['projectsUsers', payload.login, 'pagination', payload.inArchive, payload.page, 'ids'], response.items.map(project => project.id))
                .setIn(['projectsUsers', payload.login, 'pagination', payload.inArchive, payload.page, 'loaded'], true)
                .setIn(['projectsUsers', payload.login, 'pagination', payload.inArchive, payload.page, 'loading'], false)
                .setIn(['projectsUsers', payload.login, 'loaded'], true)
                .setIn(['projectsUsers', payload.login, 'loading'], false)
                .mergeIn(['projectsUsers', payload.login, 'entities'], arrToMap(response.items, ProjectRecord));

        case LOAD_PROJECTS_FOR_PAGE_NOT_FOUND:
            return state
                .setIn(['projectsUsers', payload.login, 'pagination', payload.inArchive, payload.page, 'loaded'], true)
                .setIn(['projectsUsers', payload.login, 'pagination', payload.inArchive, payload.page, 'loading'], false)
                .setIn(['projectsUsers', payload.login, 'loaded'], true)
                .setIn(['projectsUsers', payload.login, 'loading'], false);

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

export function updateProject(project) {
    debugger;
    return {
        type: UPDATE_PROJECT,
        payload: { project }
    };
}

//#endregion


//#region Sagas
export function* checkAndLoadProjectsForPageSaga() {
    while (true) {

        const { payload: { login, page, inArchive } } = yield take(CHECK_AND_LOAD_PROJECTS_FOR_PAGE);
        const { [moduleName]: { projectsUsers } } = yield select();

        const pageLoading = yield call([projectsUsers, projectsUsers.getIn], [login, 'pagination', inArchive, page, 'loading']);
        const pageLoaded = yield call([projectsUsers, projectsUsers.getIn], [login, 'pagination', inArchive, page, 'loaded']);
        const pageIds = yield call([projectsUsers, projectsUsers.getIn], [login, 'pagination', inArchive, page, 'ids']);

        if (pageLoading || pageIds || pageLoaded) {
            continue;
        }

        yield put({
            type: LOAD_PROJECTS_FOR_PAGE_START,
            payload: { page, login, inArchive }
        });

        try {
            const headers = new Headers();
            const { accessToken } = yield call(getToken);

            yield call([headers, headers.append], 'Content-Type', 'application/json');
            yield call([headers, headers.append], 'Authorization', `Bearer ${accessToken}`);

            const res = yield call(fetchApi, `/api/Projects/${login}/?page=${page}&inArchive=${inArchive}`, {
                method: 'GET', headers: headers
            });

            if (res.status === 404) {
                yield put({
                    type: LOAD_PROJECTS_FOR_PAGE_NOT_FOUND,
                    payload: { login, page, inArchive }
                });
                continue;
            }

            if (res.status >= 400) {
                throw new Error(res.statusText);
            }

            const body = yield call([res, res.json]);

            yield put({
                type: LOAD_PROJECTS_FOR_PAGE_SUCCESS,
                payload: { login, page, inArchive },
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



            debugger;
        } catch (error) {
            console.error(error);
        }
    }
}

//#endregion

export const saga = function* () {
    yield all([
        checkAndLoadProjectsForPageSaga(),
        updateProjectSaga()
    ]);
};