import { combineReducers }                       from 'redux';
import { routerReducer as router }               from 'react-router-redux';
import authReducer, { moduleName as authModule } from '../ducks/auth';
import tokenReducer, { moduleName as tokenModule } from '../ducks/token';

import { reducer as form }                       from 'redux-form';

export default combineReducers({
    router, form,
    [authModule]: authReducer,
    [tokenModule]: tokenReducer
});