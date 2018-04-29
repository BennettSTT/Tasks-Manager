import { Map, Record }                                     from "immutable";
import { appName }                                         from "../config";
import { all, select, take, call, put }                    from 'redux-saga/effects';
import { fetchApi, refreshToken }                          from "../api";
import { checkToken, getToken }                            from "../token";
import { addTask, deleteNode, getTask, loadAndUpdateTask } from "../service/tasksService";

const ReducerState = Record({
    projectsUsers: new Map({})
});

export const moduleName = 'tasks';
const prefix = `${appName}/${moduleName}`;

//#region Actions

export const LOAD_TASKS_PROJECT_START = `${prefix}/LOAD_TASKS_PROJECT_START`;
export const LOAD_TASKS_PROJECT_SUCCESS = `${prefix}/LOAD_TASKS_PROJECT_SUCCESS`;
export const LOAD_TASKS_PROJECT_NOT_FOUND = `${prefix}/LOAD_TASKS_PROJECT_SUCCESS`;
export const LOAD_TASKS_PROJECT_ERROR = `${prefix}/LOAD_TASKS_PROJECT_ERROR`;

export const CREATE_TASK_START = `${prefix}/CREATE_TASK_START`;
export const CREATE_TASK_SUCCESS = `${prefix}/CREATE_TASK_SUCCESS`;
export const CREATE_TASK_ERROR = `${prefix}/CREATE_TASK_ERROR`;

export const UPDATE_TASK_START = `${prefix}/UPDATE_TASK_START`;
export const UPDATE_TASK_SUCCESS = `${prefix}/UPDATE_TASK_SUCCESS`;
export const UPDATE_TASK_ERROR = `${prefix}/UPDATE_TASK_ERROR`;

export const DELETE_TASK_START = `${prefix}/DELETE_TASK_START`;
export const DELETE_TASK_SUCCESS = `${prefix}/DELETE_TASK_SUCCESS`;
export const DELETE_TASK_NOT_FOUND = `${prefix}/DELETE_TASK_NOT_FOUND`;
export const DELETE_TASK_ERROR = `${prefix}/DELETE_TASK_ERROR`;

export const LOAD_CHILDREN_TASK_START = `${prefix}/LOAD_TASK_START`;
export const LOAD_CHILDREN_TASK_SUCCESS = `${prefix}/LOAD_TASK_SUCCESS`;
export const LOAD_CHILDREN_TASK_NOT_FOUND = `${prefix}/LOAD_TASK_NOT_FOUND`;
export const LOAD_CHILDREN_TASK_ERROR = `${prefix}/LOAD_TASK_ERROR`;

//#endregion

export default function reducer(state = new ReducerState(), action) {
    const { type, payload, response } = action;

    switch (type) {

        case LOAD_TASKS_PROJECT_START:
            return state
                .setIn(['projectsUsers', payload.login, payload.title, "loading"], true)
                .setIn(['projectsUsers', payload.login, payload.title, "loaded"], false);

        case LOAD_TASKS_PROJECT_SUCCESS:
            return state
                .setIn(['projectsUsers', payload.login, payload.title, "loading"], false)
                .setIn(['projectsUsers', payload.login, payload.title, "loaded"], true)
                .setIn(['projectsUsers', payload.login, payload.title, "tasks"], response);

        case LOAD_CHILDREN_TASK_SUCCESS: {
            const tasks = state.getIn(['projectsUsers', payload.login, payload.title, "tasks"]);
            addTask(tasks, payload.task.id, response.children);
            return state.setIn(['projectsUsers', payload.login, payload.title, "tasks"], tasks);
        }

        case DELETE_TASK_SUCCESS: {
            const tasks = state.getIn(['projectsUsers', payload.login, payload.title, "tasks"]);
            deleteNode(tasks, payload.task.id);
            return state.setIn(['projectsUsers', payload.login, payload.title, "tasks"], tasks);
        }

        case UPDATE_TASK_SUCCESS: {
            const tasks = state.getIn(['projectsUsers', payload.login, payload.title, "tasks"]);
            loadAndUpdateTask(tasks, response.task);
            return state.setIn(['projectsUsers', payload.login, payload.title, "tasks"], tasks);
        }

        case CREATE_TASK_SUCCESS: {
            const tasks = state.getIn(['projectsUsers', payload.login, payload.title, "tasks"]);
            addTask(tasks, payload.parentId, response.task);
            return state.setIn(['projectsUsers', payload.login, payload.title, "tasks"], tasks);
        }
    }

    return state;
}


//#region Actions Creators

/**
 *
 * @param login логин юзера
 * @param title имя проекта
 * @param task задача
 * @returns {{type: string, payload: {}}}
 */
export function updateTask(login, title, task) {
    return {
        type: UPDATE_TASK_START,
        payload: {
            login, title, task
        }
    };
}

/**
 *
 * @param login логин юзера
 * @param projectTitle название проекта
 * @returns {{type: string, payload: {login: *, title: *}}}
 */
export function checkAndLoadTasksProject(login, projectTitle) {
    return {
        type: LOAD_TASKS_PROJECT_START,
        payload: { login, title: projectTitle }
    };
}

/**
 *
 * @param login логин юзера
 * @param title название проекта
 * @param task задача
 * @returns {{type: string, payload: {task: *, login: *, title: *}}}
 */
export function checkAndLoadChildrenTask(login, title, task) {
    return {
        type: LOAD_CHILDREN_TASK_START,
        payload: { task, login, title }
    };
}

/**
 *
 * @param login логин юзера
 * @param title название проекта
 * @param task новая задача
 * @param parentId id родителя. Если не передать => будет корневым элементом
 * @returns {{type: string, payload: {login: *, title: *, task: *}}}
 */
export function createTask(login, title, task, parentId) {
    return {
        type: CREATE_TASK_START,
        payload: { login, title, task, parentId }
    };
}

/**
 *
 * @param login логин юзера
 * @param title название проекта
 * @param task задача
 * @returns {{type: string, payload: {login: *, title: *, task: *}}}
 */
export function deleteTask(login, title, task) {
    return {
        type: DELETE_TASK_START,
        payload: { login, title, task }
    };
}

//#endregion

//#region Sagas

export function* updateTaskSaga() {
    while (true) {
        const { payload: { login, title, task } } = yield take(UPDATE_TASK_START);
        try {
            const check = yield call(checkToken);
            if (check) yield call(refreshToken);

            const { accessToken } = yield call(getToken);
            const headers = new Headers();

            yield call([headers, headers.append], 'Content-Type', 'application/json');
            yield call([headers, headers.append], 'Authorization', `Bearer ${accessToken}`);

            const response = yield call(fetchApi, `/api/Tasks/${task.id}`, {
                method: 'PUT', headers: headers, body: JSON.stringify(task)
            });

            if (!response.ok) {
                const message = yield call([response, response.text]);
                throw new Error(message);
            }

            const body = yield call([response, response.json]);

            yield put({
                type: UPDATE_TASK_SUCCESS,
                payload: { login, title, task },
                response: { task: body }
            });
        } catch (error) {
            yield put({
                type: UPDATE_TASK_ERROR,
                payload: { login, title, task },
                error
            });
        }
    }
}

export function* checkAndLoadChildrenTaskSaga() {
    while (true) {
        const { payload: { login, title, task } } = yield take(LOAD_CHILDREN_TASK_START);
        const { [moduleName]: { projectsUsers } } = yield select();

        const tasks = yield call([projectsUsers, projectsUsers.getIn], [login, title, "tasks"]);

        try {
            // Проверка на отсутствие таска
            // стоит добавить поле loading для предотвращения
            // 100500 кликов в секунду
            const taskInState = yield call(getTask, tasks, task.id);
            if (taskInState.children.length !== 0) continue;

            const check = yield call(checkToken);
            if (check) yield call(refreshToken);

            const { accessToken } = yield call(getToken);
            const headers = new Headers();

            yield call([headers, headers.append], 'Content-Type', 'application/json');
            yield call([headers, headers.append], 'Authorization', `Bearer ${accessToken}`);

            const response = yield call(fetchApi, `/api/Tasks/${task.id}`, { method: 'GET', headers: headers });

            if (!response.ok) {
                const message = yield call([response, response.text]);
                throw new Error(message);
            }

            const children = yield call([response, response.json]);

            // Если массив пуст => Not Found
            if (children.length === 0) {
                yield put({
                    type: LOAD_CHILDREN_TASK_NOT_FOUND,
                    payload: { login, title, task }
                });
                continue;
            }

            // Если все хорошо, сохраняет новый таск
            yield put({
                type: LOAD_CHILDREN_TASK_SUCCESS,
                payload: { login, title, task },
                response: { children: children[0] }
            });

        } catch (error) {
            yield put({
                type: LOAD_CHILDREN_TASK_ERROR,
                payload: { login, title, task },
                error
            });
        }
    }
}

export function* createTaskSaga() {
    while (true) {
        const { payload: { login, title, task, parentId } } = yield take(CREATE_TASK_START);
        try {
            const check = yield call(checkToken);
            if (check) yield call(refreshToken);

            const { accessToken } = yield call(getToken);
            const headers = new Headers();

            yield call([headers, headers.append], 'Content-Type', 'application/json');
            yield call([headers, headers.append], 'Authorization', `Bearer ${accessToken}`);

            const response = yield call(fetchApi, `/api/Tasks`, {
                method: 'POST', headers: headers, body: JSON.stringify(task)
            });

            if (!response.ok) {
                const message = yield call([response, response.text]);
                throw new Error(message);
            }

            const body = yield call([response, response.json]);

            yield put({
                type: CREATE_TASK_SUCCESS,
                payload: { login, title, task, parentId },
                response: { task: body }
            });

        } catch (error) {
            console.error(error);
            yield put({
                type: CREATE_TASK_ERROR,
                payload: { login, title, task, parentId }
            });
            debugger;
        }
    }
}

export function* checkAndLoadTasksProjectSaga() {
    while (true) {
        const { payload: { login, title } } = yield take(LOAD_TASKS_PROJECT_START);
        try {
            const { [moduleName]: { projectsUsers } } = yield select();

            const Loading = yield call([projectsUsers, projectsUsers.getIn], [login, title, 'loading']);
            const Loaded = yield call([projectsUsers, projectsUsers.getIn], [login, title, 'loaded']);

            if (Loaded && !Loading) continue;

            const check = yield call(checkToken);
            if (check) yield call(refreshToken);

            const { accessToken } = yield call(getToken);
            const headers = new Headers();

            yield call([headers, headers.append], 'Content-Type', 'application/json');
            yield call([headers, headers.append], 'Authorization', `Bearer ${accessToken}`);

            const response = yield call(fetchApi, `/api/Tasks?login=${login}&title=${title}&level=1`, {
                method: 'GET',
                headers: headers
            });

            if (!response.ok) {
                const message = yield call([response, response.text]);
                throw new Error(message);
            }

            const body = yield call([response, response.json]);

            // let test = function (obj, id) {
            //     if (obj.id === id) {
            //         obj.children.push({
            //             "id": 1488,
            //             "title": "TestParent2",
            //             "level": 1,
            //             "dueDate": "2018-04-23T00:00:00",
            //             "createDate": "2018-04-23T00:00:00",
            //             "completeDate": "2018-04-23T00:00:00",
            //             "status": 1,
            //             "children": []
            //         });
            //     }
            //
            //
            //     for (let object of obj.children) {
            //         test(object, id);
            //     }
            // };
            // for (let task of body) {
            //     test(task, 6);
            // }

            yield put({
                type: LOAD_TASKS_PROJECT_SUCCESS,
                payload: { login, title },
                response: body
            });
        } catch (error) {
            debugger;
            yield put({
                type: LOAD_TASKS_PROJECT_ERROR,
                payload: { login, title },
                error
            });
        }
    }
}

export function* deleteTaskSaga() {
    while (true) {
        const { payload: { login, title, task } } = yield take(DELETE_TASK_START);

        try {
            const check = yield call(checkToken);
            if (check) yield call(refreshToken);

            const { accessToken } = yield call(getToken);
            const headers = new Headers();

            yield call([headers, headers.append], 'Content-Type', 'application/json');
            yield call([headers, headers.append], 'Authorization', `Bearer ${accessToken}`);

            const response = yield call(fetchApi, `/api/Tasks/${task.id}`, {
                method: 'DELETE',
                headers: headers
            });

            if (response.status === 404) {
                yield put({
                    type: DELETE_TASK_NOT_FOUND,
                    payload: { login, title, task }
                });
                continue;
            }

            if (!response.ok) {
                const message = yield call([response, response.text]);
                throw new Error(message);
            }

            // Если все хорошо, сохраняет новый таск
            yield put({
                type: DELETE_TASK_SUCCESS,
                payload: { login, title, task }
            });


        } catch (error) {
            yield put({
                type: DELETE_TASK_ERROR,
                payload: { login, title, task },
                error
            });
        }
    }
}

//#endregion

export const saga = function* () {
    yield all([
        checkAndLoadTasksProjectSaga(),
        checkAndLoadChildrenTaskSaga(),
        createTaskSaga(),
        deleteTaskSaga(),
        updateTaskSaga()
    ]);
};