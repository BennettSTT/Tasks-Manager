import React, { Component }                                 from 'react';
import { connect }                                          from 'react-redux';
import { Route }                                            from 'react-router-dom';
import { initializeApp, moduleName as authModule, signOut } from '../ducks/auth';
import AuthPage                                             from './routes/AuthPage';
import NotFound                                             from './routes/NotFound';
import ProjectsPage                                         from "./routes/ProjectsPage";
import ProtectedRoute                                       from './common/ProtectedRoute';
import { Switch }                                           from "react-router";
import HomePage                                             from "./routes/HomePage";
import Loader                                               from "./common/Loader";

class App extends Component {

    componentDidMount() {
        const { initializeAppLoaded, initializeAppLoading, initializeApp } = this.props;

        console.log('componentDidMount', 'App', initializeAppLoaded, initializeAppLoading);

        if (!initializeAppLoaded && !initializeAppLoading) {
            initializeApp();
        }
    }

    render() {
        const { initializeAppLoading } = this.props;

        if (initializeAppLoading) return <Loader/>;

        return (
            <Switch>
                <Route exact path = '/' component = {HomePage}/>
                <Route path = '/auth' component = { AuthPage } />
                <Route path = '/:project' component = { ProjectsPage } />
                {/*<Route path = '*' component = { NotFound } />*/}
            </Switch>
        );
    }
}

export default connect(state => ( {
    signedIn: !!state[authModule].user,
    initializeAppLoaded: state[authModule].initializeAppLoaded,
    initializeAppLoading: state[authModule].initializeAppLoading,
} ), { signOut, initializeApp }, null, { pure: false })(App);
