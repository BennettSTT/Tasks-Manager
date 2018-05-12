import React, { Component } from 'react';
import { connect }          from 'react-redux';
import { Route }            from 'react-router-dom';
import {
    initializeApp,
    moduleName as authModule,
    signOut
}                           from '../ducks/auth';
import AuthPage             from './routes/AuthPage/AuthPage';
import ProjectListPage      from "./routes/ProjectListPage/ProjectListPage";
import ProtectedRoute       from './common/ProtectedRoute';
import { Switch }           from "react-router";
import HomePage             from "./routes/HomePage/HomePage";
import Loader               from "./common/Loader";
import NewProjectPage       from "./routes/CreateProjectPage/CreateProjectPage";
import ProjectPage          from "./routes/ProjectPage/ProjectPage";
import TasksPage            from "./routes/TasksPage/TasksPage";

class App extends Component {

    componentDidMount() {
        const { initializeAppLoaded, initializeAppLoading, initializeApp } = this.props;
        if (!initializeAppLoaded && !initializeAppLoading) {
            initializeApp();
        }
    }

    render() {
        const { initializeAppLoading } = this.props;

        if (initializeAppLoading) return <Loader/>;

        return (
            <Switch>
                <Route exact path='/' component={ HomePage }/>
                <Route path='/auth' component={ AuthPage }/>
                <ProtectedRoute path='/new' component={ NewProjectPage }/>
                <ProtectedRoute path='/:login/:projectTitle/tasks' component={ TasksPage }/>
                <ProtectedRoute path='/:login/:projectTitle' component={ ProjectPage }/>
                <ProtectedRoute path='/:login' component={ ProjectListPage }/>
                { /*<Route path = '*' component = { NotFound } />*/ }
            </Switch>
        );
    }
}

export default connect(state => ({
    signedIn: !!state[authModule].user,
    initializeAppLoaded: state[authModule].initializeAppLoaded,
    initializeAppLoading: state[authModule].initializeAppLoading,
}), { signOut, initializeApp }, null, { pure: false })(App);
