import { appName }                              from '../config';
import { Record }                               from 'immutable';
import { all, call, put, take }                 from 'redux-saga/effects';
import { GWT0, getToken, setToken, clearToken } from "../utils";
import { push }                                 from 'react-router-redux';
import history                                  from '../history';
import { fetchApi }                             from "../components/common/Api";

const ReducerRecord = Record({
    user: null,
    error: null,
    loading: false,
    loaded: false,
    initializeAppLoaded: false,
    initializeAppLoading: false
});

const UserRecord = Record({
    login: null,
    refreshToken: null,
    role: null
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

//#endregion

export default function reducer(state = new ReducerRecord(), action) {
    const { type, payload, error } = action;

    switch (type) {

        //#region Юзер
        case SIGN_UP_REQUEST:
            return state
                .set('loading', true)
                .set('loaded', false);

        case SIGN_UP_SUCCESS:
        case SIGN_IN_SUCCESS:
            setToken(JSON.stringify(payload.token));

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


        case SIGN_OUT_SUCCESS:
            return new ReducerRecord();
        //#endregion

        //#region Инициализация приложения
        case INITIALIZE_APP_START:
            return state
                .set('initializeAppLoading', true)
                .set('initializeAppLoaded', false)
                .set('loading', true)
                .set('loaded', false);

        case INITIALIZE_APP_AUTHORIZED:
            setToken(JSON.stringify(payload.token));

            return state
                .set('initializeAppLoading', false)
                .set('initializeAppLoaded', true)
                .set('user', new UserRecord(payload.user))
                .set('loading', false)
                .set('loaded', true);
        //#endregion

        default:
            return state;
    }
}

//#region Actions Creators
export function initializeApp() {
    return {
        type: INITIALIZE_APP_START
    };
}

// Вход в аккаунт
export function signUp(login, password) {
    return {
        type: SIGN_UP_REQUEST,
        payload: { login, password }
    };
}

// Регистрация
export function signIn(email, password, login) {
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
        // редиректим на авторизацию
        if (!token) {
            yield put({
                type: INITIALIZE_APP_NOT_AUTHORIZED
            });
            yield call([history, history.push], '/auth/sing-in');
            return;
        }

        const expiresIn = new Date(token.expiresIn);
        const GWT0Now = yield call(GWT0);

        // Если токен старый - обновляем все токены
        const newToken = expiresIn < GWT0Now
            ? yield call(refreshTokenSaga, token.refreshToken)
            : token;

        // загружаем инфу о юзере
        const user = yield call(userInfoFetchSaga, newToken);

        yield put({
            type: INITIALIZE_APP_AUTHORIZED,
            payload: { user, token: newToken }
        });
    } catch (error) {
        yield put({
            type: INITIALIZE_APP_ERROR,
            error
        });
    }

};

const refreshTokenSaga = function* (token) {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const options = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(token),
        cache: 'no-cache'
    };

    const res = yield call(fetchApi, '/auth/refresh-token', options);

    if (res.status >= 400) {
        throw new Error(res.statusText);
    }
    return yield call([res, res.json]);
};

const userInfoFetchSaga = function* (token) {
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${token.accessToken}`);

    const options = {
        method: 'GET',
        headers: headers,
        cache: 'no-cache'
    };

    const res = yield call(fetchApi, `/auth/user-info/${token.refreshToken.userId}`, options);

    if (res.status >= 400) {
        throw new Error(res.statusText);
    }
    return yield call([res, res.json]);
};

// Вход в аккаунт
export const signUpSaga = function* () {
    while (true) {
        const action = yield take(SIGN_UP_REQUEST);

        const headers = new Headers();
        headers.append("Content-Type", "application/json");

        const options = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(action.payload),
            cache: 'no-cache'
        };

        try {
            const res = yield call(fetchApi, '/auth/sing-up', options);
            if (res.status >= 400) {
                throw new Error(res.statusText);
            }

            const token = yield call([res, res.json]);

            // загружаем инфу о юзере
            const user = yield call(userInfoFetchSaga, token);

            yield put({
                type: SIGN_UP_SUCCESS,
                payload: { user, token }
            });
        } catch (error) {
            yield put({
                type: SIGN_UP_ERROR,
                error
            });
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
            yield put(push('/auth/sign-in'));
        } catch (_) {
            //
        }
    }
};

// Регистрация
export const signInSaga = function* () {
    while (true) {
        try {
            const action = yield take(SIGN_IN_REQUEST);

            console.log(action.payload);
            debugger;

            const headers = new Headers();
            headers.append("Content-Type", "application/json");

            const res = yield call(fetch, '/auth/register',
                { method: 'POST', headers: headers, body: JSON.stringify(action.payload) }
            );

            if (res.status >= 400) {
                throw new Error(res.statusText);
            }

            const body = yield call([res, res.json]);
            yield put({
                type: SIGN_IN_SUCCESS,
                payload: {
                    user: body.user,
                    token: body.token
                }
            });

        } catch (error) {
            yield put({
                type: SIGN_IN_ERROR,
                error: error.message
            });
        }
    }
};

export const saga = function* () {
    yield all([
        signInSaga(),
        signUpSaga(),
        signOutSaga(),
        initializeAppSaga()
    ]);
};