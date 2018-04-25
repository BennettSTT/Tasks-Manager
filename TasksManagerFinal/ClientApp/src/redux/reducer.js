import { combineReducers }                               from 'redux';
import { routerReducer as router }                       from 'react-router-redux';
import authReducer, { moduleName as authModule }         from '../ducks/auth';
import projectsReducer, { moduleName as projectsModule } from "../ducks/projects";
import tasksReducer, { moduleName as tasksModule }       from "../ducks/tasks";
import { reducer as form }                               from 'redux-form';

export default combineReducers({
    router, form,
    [authModule]: authReducer,
    [projectsModule]: projectsReducer,
    [tasksModule]: tasksReducer
});