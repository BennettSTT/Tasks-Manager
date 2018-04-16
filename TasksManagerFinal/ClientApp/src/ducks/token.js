import { appName }                                                                            from '../config';
import { Record }                                                                             from 'immutable';
import { all, cps, call, put, take, takeEvery }                                               from 'redux-saga/effects';
import { push }                                                                               from 'react-router-redux';
import {
    SIGN_IN_ERROR,
    SIGN_IN_REQUEST,
    SIGN_IN_SUCCESS,
} from "./auth";


const ReducerRecord = Record({
    // TODO: Ставить loaded=true есть есть токен
    token: localStorage['token'],
    error: null,
    loading: false,
    loaded: false
});

export const moduleName = 'token';

export default function reducer(state = new ReducerRecord(), action) {
    const { type, payload, error } = action;

    switch (type) {
        case SIGN_IN_REQUEST:
            return state
                .set('loading', true)
                .set('loaded', false);

        case SIGN_IN_SUCCESS:
            localStorage['token'] = JSON.stringify(payload.token);

            return state
                .set('loading', false)
                .set('loaded', true)
                .set('token', JSON.parse(localStorage['token']))
                .set('error', null);

        case SIGN_IN_ERROR:
            return state
                .set('loading', false)
                .set('loaded', false)
                .set('error', error);

        default:
            return state;
    }
}
