import { Map, OrderedMap, Record }              from "immutable";
import { appName }                              from "../config";
import { arrToMap }                             from "../utils";
import { all, select, take, call, put }         from 'redux-saga/effects';
import { fetchApi }                             from "../components/common/Api";
import { GWT0, getToken, setToken, clearToken } from "../utils";


const ProjectRecord = Record({
    id: null,
    title: null,
    description: null,
    inArchive: null,
    openTasksCount: null
});

const ProjectsUsersRecord = Record({
    entities: new OrderedMap({}),
    pagination: new Map({}),
    sort: null,
    page: null,
    pageSize: null,
    totalItemsCount: null,
    totalPagesCount: null
});


const ReducerState = Record({
    projectsUsers: new Map({})
});


export const moduleName = 'projects';
const prefix = `${appName}/${moduleName}`;

//#region Actions
export const ADD_PROJECT = `${prefix}/ADD_PROJECT`;
export const CHECK_AND_LOAD_PROJECTS_FOR_PAGE = `${prefix}/CHECK_AND_LOAD_PROJECTS_FOR_PAGE`;
export const LOAD_PROJECTS_FOR_PAGE_START = `${prefix}/LOAD_PROJECTS_FOR_PAGE_START`;
export const LOAD_PROJECTS_FOR_PAGE_SUCCESS = `${prefix}/LOAD_PROJECTS_FOR_PAGE_SUCCESS`;
export const LOAD_PROJECTS_FOR_PAGE_ERROR = `${prefix}/LOAD_PROJECTS_FOR_PAGE_ERROR`;

export const LOAD_PROJECTS_FOR_PAGE = `${prefix}/LOAD_PROJECTS_FOR_PAGE`;

export default function reducer(state = new ReducerState(), action) {
    const { type, payload, response } = action;

    const response1 = {
        "items": [
            {
                "id": 1,
                "title": "Title project 1 ",
                "description": "Discription project 1",
                "inArchive": false,
                "openTasksCount": 0
            },
            {
                "id": 2,
                "title": "Title project 1 ",
                "description": "Discription project 1",
                "inArchive": false,
                "openTasksCount": 0
            },
            {
                "id": 3,
                "title": "Title project 1 ",
                "description": "Discription project 1",
                "inArchive": false,
                "openTasksCount": 0
            },
            {
                "id": 4,
                "title": "Title project 1 ",
                "description": "Discription project 1",
                "inArchive": false,
                "openTasksCount": 0
            },
            {
                "id": 5,
                "title": "Title project 1 ",
                "description": "Discription project 1",
                "inArchive": false,
                "openTasksCount": 0
            }
        ],
        "sort": "Id",
        "page": 1,
        "pageSize": 10,
        "totalItemsCount": 5,
        "totalPagesCount": 1
    };
    const response2 = {
        "items": [
            {
                "id": 12,
                "title": "Title project 1 ",
                "description": "Discription project 1",
                "inArchive": false,
                "openTasksCount": 0
            },
            {
                "id": 5,
                "title": "Title project 1 ",
                "description": "Discription project 1",
                "inArchive": false,
                "openTasksCount": 0
            },
            {
                "id": 6,
                "title": "Title project 1 ",
                "description": "Discription project 1",
                "inArchive": false,
                "openTasksCount": 0
            },
            {
                "id": 7,
                "title": "Title project 1 ",
                "description": "Discription project 1",
                "inArchive": false,
                "openTasksCount": 0
            },
            {
                "id": 8,
                "title": "Title project 1 ",
                "description": "Discription project 1",
                "inArchive": false,
                "openTasksCount": 0
            }
        ],
        "sort": "Id",
        "page": 1,
        "pageSize": 10,
        "totalItemsCount": 5,
        "totalPagesCount": 1
    };

    switch (type) {
        // case ADD_PROJECT:
        //     return state.setIn(['entities', randomId], new CommentRecord({...payload.comment, id: randomId}))

        // case LOAD_ARTICLE_COMMENTS + SUCCESS:
        //     return state.update('entities', entities => entities.merge(arrToMap(response, ProjectRecord)))

        case LOAD_PROJECTS_FOR_PAGE_START:
            return state
                .setIn(['projectsUsers', payload.login, 'pagination', payload.page, 'loaded'], false)
                .setIn(['projectsUsers', payload.login, 'pagination', payload.page, 'loading'], true);

        case LOAD_PROJECTS_FOR_PAGE_SUCCESS:
            return state
                .setIn(['projectsUsers', payload.login, 'totalItemsCount'], response.totalItemsCount)
                .setIn(['projectsUsers', payload.login, 'pageSize'], response.pageSize)
                .setIn(['projectsUsers', payload.login, 'totalPagesCount'], response.totalPagesCount)
                .setIn(['projectsUsers', payload.login, 'pagination', payload.page, 'ids'],
                    response.items.map(project => project.id))
                .setIn(['projectsUsers', payload.login, 'pagination', payload.page, 'loaded'], true)
                .setIn(['projectsUsers', payload.login, 'pagination', payload.page, 'loading'], false)
                .mergeIn(['projectsUsers', payload.login, 'entities'], arrToMap(response.items, ProjectRecord));

        // return state = !!state.getIn(['projectsUsers', payload.login])
        //     ? state.updateIn(['projectsUsers', payload.login], login => (
        //         {
        //             ...response,
        //             entities: login.get('entities').merge(arrToMap(response.items, ProjectRecord)),
        //             pagination: login.get('pagination').concat(response.items.map(project => project.id))
        //         } ))
        //     : state.setIn(['projectsUsers', payload.login], new ProjectsUsersRecord(
        //         {
        //             ...response,
        //             entities: arrToMap(response.items, ProjectRecord),
        //             pagination: response.items.map(project => project.id)
        //         })
        //     );
    }

    return state;
}

export function checkAndLoadProjectsForPage(login, page) {
    return {
        type: CHECK_AND_LOAD_PROJECTS_FOR_PAGE,
        payload: { login, page }
    };
}

export function* checkAndLoadProjectsForPageSaga() {
    while (true) {

        const { payload: { login, page } } = yield take(CHECK_AND_LOAD_PROJECTS_FOR_PAGE);
        const { [moduleName]: { projectsUsers } } = yield select();

        const pageLoading = yield call([projectsUsers, projectsUsers.getIn], [login, 'pagination', page, 'loading']);
        const pageIds = yield call([projectsUsers, projectsUsers.getIn], [login, 'ids']);

        if (pageLoading || pageIds) {
            continue;
        }

        yield put({
            type: LOAD_PROJECTS_FOR_PAGE_START,
            payload: { page, login }
        });

        try {
            const headers = new Headers();
            const token = yield call(getToken);

            headers.append("Content-Type", "application/json");
            headers.append("Authorization", `Bearer ${token.accessToken}`);

            const res = yield call(fetchApi, `/api/${login}/?page=${page}`, {
                method: 'GET', headers: headers
            });

            if (res.status >= 400) {
                throw new Error(res.statusText);
            }

            const body = yield call([res, res.json]);

            yield put({
                type: LOAD_PROJECTS_FOR_PAGE_SUCCESS,
                payload: { login, page },
                response: body
            });
        } catch (e) {
            console.error(e);
            debugger;
        }
    }
}

export const saga = function* () {
    yield all([
        checkAndLoadProjectsForPageSaga()
    ]);
};