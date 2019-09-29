import { appName }                                    from '../config';
import { Record }                                     from 'immutable';
import { all, call, put, take }                       from 'redux-saga/effects';
import { getToken, setToken, clearToken, checkToken } from "../token";
import { push }                                       from 'react-router-redux';
import { fetchApi, refreshToken }                     from "../api";

const ReducerRecord = Record({
    user: null,
    error: null,
    loading: false,
    loaded: false,
    initializeAppLoaded: false,
    initializeAppLoading: false,
    OpenInArchive: false
});

const UserRecord = Record({
    login: null,
    refreshToken: null
});

export const moduleName = 'auth';
const prefix = `${appName}/${moduleName}`;

//#region Actions
export const SIGN_UP_REQUEST = `${prefix}/SIGN_UP_REQUEST`;
export const SIGN_UP_SUCCESS = `${prefix}/SIGN_UP_SUCCESS`;
export const SIGN_UP_ERROR = `${prefix}/SIGN_UP_ERROR`;

export const INITIALIZE_APP_START = `${prefix}/INITIALIZE_APP_START`;
export const INITIALIZE_APP_AUTHORIZED = `${prefix}/INITIALIZE_APP_AUTHORIZED`;
export const INITIALIZE_APP_NOT_AUTHORIZED = `${prefix}/INITIALIZE_APP_NOT_AUTHORIZED`;
export const INITIALIZE_APP_ERROR = `${prefix}/INITIALIZE_APP_ERROR`;

export const SIGN_IN_REQUEST = `${prefix}/SIGN_IN_REQUEST`;
export const SIGN_IN_SUCCESS = `${prefix}/SIGN_IN_SUCCESS`;
export const SIGN_IN_ERROR = `${prefix}/SIGN_IN_ERROR`;

export const SIGN_OUT_REQUEST = `${prefix}/SIGN_OUT_REQUEST`;
export const SIGN_OUT_SUCCESS = `${prefix}/SIGN_OUT_SUCCESS`;

export const SHOW_ARCHIVE_PROJECTS = `${prefix}/SHOW_ARCHIVE_PROJECTS`;
export const SHOW_OPEN_PROJECTS = `${prefix}/SHOW_OPEN_PROJECTS`;

//#endregion

export default function reducer(state = new ReducerRecord(), action) {
    const { type, payload, error } = action;

    switch (type) {

        case SHOW_ARCHIVE_PROJECTS:
            return state
                .set('OpenInArchive', true);

        case SHOW_OPEN_PROJECTS:
            return state
                .set('OpenInArchive', false);

        //#region Юзер
        case SIGN_UP_REQUEST:
            return state
                .set('loading', true)
                .set('loaded', false);

        case SIGN_UP_SUCCESS:
        case SIGN_IN_SUCCESS:
            return state
                .set('loading', false)
                .set('loaded', true)
                .set('user', new UserRecord(payload.user))
                .set('error', null);

        case SIGN_UP_ERROR:
            return state
                .set('loading', false)
                .set('loaded', true)
                .set('error', error);


        case SIGN_IN_ERROR:
            return state
                .set('error', error);

        case SIGN_OUT_SUCCESS:
            return new ReducerRecord();
        //#endregion

        //#region Инициализация приложения
        case INITIALIZE_APP_START:
            return state
                .set('initializeAppLoading', true)
                .set('loading', true)
                .set('loaded', false);

        case INITIALIZE_APP_AUTHORIZED:
            return state
                .set('initializeAppLoading', false)
                .set('initializeAppLoaded', true)
                .set('user', new UserRecord(payload.user))
                .set('loading', false)
                .set('loaded', true);

        case INITIALIZE_APP_NOT_AUTHORIZED:
            return state
                .set('initializeAppLoading', false)
                .set('initializeAppLoaded', true);

        case INITIALIZE_APP_ERROR:
            return state
                .set('initializeAppLoading', false)
                .set('initializeAppLoaded', true)
                .set('error', error)
                .set('user', null);
        //#endregion

        default:
            return state;
    }
}

export function showOpenProjects() {
    return {
        type: SHOW_OPEN_PROJECTS
    };
}

export function showArchiveProjects() {
    return {
        type: SHOW_ARCHIVE_PROJECTS
    };
}

//#region Actions Creators
export function initializeApp() {
    return {
        type: INITIALIZE_APP_START
    };
}

// Вход в аккаунт
export function login(login, password) {
    return {
        type: SIGN_UP_REQUEST,
        payload: { login, password }
    };
}

// Регистрация
export function register(email, password, login) {
    return {
        type: SIGN_IN_REQUEST,
        payload: { email, password, login }
    };
}

// Выход с сайта
export function signOut() {
    return {
        type: SIGN_OUT_REQUEST
    };
}

//#endregion

export const initializeAppSaga = function* () {
    yield take(INITIALIZE_APP_START);

    try {
        let token = yield call(getToken);

        // Если токена нету - юзер не авторизован
        if (!token) {
            return yield put({
                type: INITIALIZE_APP_NOT_AUTHORIZED
            });
        }

        const check = yield call(checkToken);
        if (check) yield call(refreshToken);

        const user = yield call(userInfoFetchSaga);

        yield put({
            type: INITIALIZE_APP_AUTHORIZED,
            payload: { user }
        });
    } catch (error) {
        debugger;
        yield put({
            type: INITIALIZE_APP_ERROR,
            error
        });
    }

};

const userInfoFetchSaga = function* () {
    const check = yield call(checkToken);
    if (check) yield call(refreshToken);

    const { accessToken, refreshToken: { userId } } = yield call(getToken);
    const headers = new Headers();
    yield call([headers, headers.append], "Authorization", `Bearer ${accessToken}`);

    const res = yield call(fetchApi, `/api/Users/${userId}`, {
        method: 'GET',
        headers: headers,
        cache: 'no-cache'
    });

    if (!res.ok) {
        const message = yield call([res, res.text]);
        throw new Error(message);
    }

    return yield call([res, res.json]);
};

// Вход в аккаунт
export const loginSaga = function* () {
    while (true) {
        const action = yield take(SIGN_UP_REQUEST);
        const headers = new Headers();

        yield call([headers, headers.append], "Content-Type", "application/json");
        const body = yield call([JSON, JSON.stringify], action.payload);

        try {
            const res = yield call(fetchApi, '/api/Auth/login', { method: 'POST', headers: headers, body: body });

            if (!res.ok) {
                const message = yield call([res, res.text]);

                throw new Error(message);
            }

            const token = yield call([res, res.json]);
            const strToken = yield call([JSON, JSON.stringify], token);
            yield call(setToken, strToken);

            const user = yield call(userInfoFetchSaga);

            yield put({ type: SIGN_UP_SUCCESS, payload: { user } });
            yield put(push(`/${user.login}`));
        } catch (error) {
            yield put({ type: SIGN_UP_ERROR, error });
        }
    }
};

// Выход с сайта
export const signOutSaga = function* () {
    while (true) {
        yield take(SIGN_OUT_REQUEST);
        try {
            yield call(clearToken);

            yield put({
                type: SIGN_OUT_SUCCESS
            });
            yield put(push('/auth/login'));
        } catch (_) {
            //
        }
    }
};

// Регистрация
export const registerSaga = function* () {
    while (true) {
        try {
            const action = yield take(SIGN_IN_REQUEST);
            const headers = new Headers();
            headers.append("Content-Type", "application/json");

            const res = yield call(fetch, '/api/Auth/register',
                { method: 'POST', headers: headers, body: JSON.stringify(action.payload) }
            );

            if (!res.ok) {
                const message = yield call([res, res.text]);

                throw new Error(message);
            }

            const token = yield call([res, res.json]);
            const strToken = yield call([JSON, JSON.stringify], token);
            yield call(setToken, strToken);

            const user = yield call(userInfoFetchSaga);

            yield put({
                type: SIGN_IN_SUCCESS,
                payload: {
                    token: strToken,
                    user
                }
            });

            yield put(push(`/${user.login}`));
        } catch (error) {
            yield put({
                type: SIGN_IN_ERROR,
                error
            });
        }
    }
};

export const saga = function* () {
    yield all([
        registerSaga(),
        loginSaga(),
        signOutSaga(),
        initializeAppSaga()
    ]);
};