import { appName }              from '../config';
import { Record }               from 'immutable';
import { all, call, put, take } from 'redux-saga/effects';
import { GWT0, getToken }       from "../utils";
import history                  from '../history';
import { fetchApi }             from "../components/common/Api";

const ReducerRecord = Record({
    user: null,
    error: null,
    loading: false,
    loaded: false,
    initializeAppLoaded: false,
    initializeAppLoading: false
});

const UserRecord = Record({
    role: null,
    email: null,
    refreshToken: null,
    expiresInRefreshToken: null
});

export const moduleName = 'auth';
const prefix = `${appName}/${moduleName}`;

//#region Actions
export const SIGN_UP_REQUEST = `${prefix}/SIGN_UP_REQUEST`;
export const SIGN_UP_SUCCESS = `${prefix}/SIGN_UP_SUCCESS`;
export const SIGN_UP_ERROR = `${prefix}/SIGN_UP_ERROR`;

export const INITIALIZE_APP_START = `${prefix}/INITIALIZE_APP_REQUEST`;
export const INITIALIZE_APP_SUCCESS = `${prefix}/INITIALIZE_APP_SUCCESS`;
export const INITIALIZE_APP_ERROR = `${prefix}/INITIALIZE_APP_ERROR`;

export const REFRESH_TOKEN_START = `${prefix}/REFRESH_TOKEN_START`;
export const REFRESH_TOKEN_SUCCESS = `${prefix}/REFRESH_TOKEN_SUCCESS`;
export const REFRESH_TOKEN_ERROR = `${prefix}/REFRESH_TOKEN_ERROR`;

export const USER_INFO_REQUEST = `${prefix}/USER_INFO_REQUEST`;
export const USER_INFO_SUCCESS = `${prefix}/USER_INFO_SUCCESS`;
export const USER_INFO_ERROR = `${prefix}/USER_INFO_ERROR`;

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

        case SIGN_IN_SUCCESS:
            localStorage['token'] = JSON.stringify(payload.token);

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

        // TODO: Разобраться с loaded и loading юзера
        //#region Инициализация приложения
        case INITIALIZE_APP_START:
            return state
                .set('initializeAppLoading', true)
                .set('initializeAppLoaded', false);

        case INITIALIZE_APP_SUCCESS:
            localStorage['token'] = JSON.stringify(payload.token);

            return state
                .set('initializeAppLoading', false)
                .set('initializeAppLoaded', true)
                .set('user', new UserRecord(payload.user))
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

export function signUp(email, password) {
    return {
        type: SIGN_UP_REQUEST,
        payload: { email, password }
    };
}

export function signIn(email, password) {
    return {
        type: SIGN_IN_REQUEST,
        payload: { email, password }
    };
}

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
        if (!token) yield call([history, history.push], '/auth/sing-in');

        const expiresIn = new Date(token.expiresIn);
        const GWT0Now = yield call(GWT0);

        // Если токен старый - обновляем все токены
        const newToken = expiresIn < GWT0Now ? yield call(refreshTokenSaga, token.refreshToken) : token;

        // загружаем инфу о юзере
        const user = yield call(userInfoFetchSaga, newToken);

        yield put({
            type: INITIALIZE_APP_SUCCESS,
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


export const signUpSaga = function* () {
    // const auth = firebase.auth();
    //
    // while (true) {
    //     const action = yield take(SIGN_UP_REQUEST);
    //
    //     try {
    //         const user = yield call(
    //             [auth, auth.createUserWithEmailAndPassword],
    //             action.payload.email, action.payload.password
    //         );
    //         yield put({
    //             type: SIGN_UP_SUCCESS,
    //             payload: { user }
    //         });
    //     } catch (error) {
    //         yield put({
    //             type: SIGN_UP_ERROR,
    //             error
    //         });
    //     }
    // }
};
export const watchStatusChange = function* () {
    // const auth = firebase.auth();
    // try {
    //     yield cps([auth, auth.onAuthStateChanged]);
    // } catch (user) {
    //     yield put({
    //         type: SIGN_IN_SUCCESS,
    //         payload: { user }
    //     });
    // }
};

export const signOutSaga = function* () {
    // const auth = firebase.auth();
    //
    // try {
    //     yield call([auth, auth.signOut]);
    //     yield put({
    //         type: SIGN_OUT_SUCCESS
    //     });
    //     yield put(push('/auth/signin'));
    // } catch (_) {
    //     //
    // }
};

// TODO: Переписать на try cathe (убрать continue)
export const signInSaga = function* () {
    while (true) {
        const action = yield take(SIGN_IN_REQUEST);

        const headers = new Headers();
        headers.append("Content-Type", "application/json");

        const res = yield call(fetch, '/auth/register',
            { method: 'POST', headers: headers, body: JSON.stringify(action.payload) }
        );

        if (res.status >= 400) {
            yield put({
                type: SIGN_IN_ERROR,
                error: res.statusText
            });
            continue;
        }

        const body = yield call([res, res.json]);
        yield put({
            type: SIGN_IN_SUCCESS,
            payload: {
                user: body.user,
                token: body.token
            }
        });
    }
};

export const saga = function* () {
    yield all([
        signInSaga(),
        initializeAppSaga()
    ]);
};