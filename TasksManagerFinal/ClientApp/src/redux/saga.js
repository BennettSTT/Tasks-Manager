import { saga as authSaga }     from '../ducks/auth';
import { saga as projectsSaga } from "../ducks/projects";
import { all }                  from 'redux-saga/effects';

export default function* rootSaga() {
    yield all([
        authSaga(),
        projectsSaga()
    ]);
}