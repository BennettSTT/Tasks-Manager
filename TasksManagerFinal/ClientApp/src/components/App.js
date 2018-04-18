import React, { Component }                   from 'react';
import { connect }                            from 'react-redux';
import { Route }                              from 'react-router-dom';
import { initializeApp, moduleName, signOut } from '../ducks/auth';
import AuthPage                               from './routes/AuthPage';
import { Link }                               from 'react-router-dom';
import NotFound                               from './routes/NotFound';
import ProjectPage                            from "./routes/ProjectPage";
import ProtectedRoute                         from './common/ProtectedRoute';
import { Switch }                             from "react-router";
import HomePage                               from "./routes/HomePage";

class App extends Component {

    componentDidMount() {
        const { initializeAppLoaded, initializeApp } = this.props;

        if (!initializeAppLoaded) {
            initializeApp();
        }
    }

    render() {
        const { signOut, signedIn } = this.props;

        const btn = signedIn
            ? <button onClick = { signOut }>Sign out</button>
            : <Link to = '/auth/sing-in'>sign in</Link>;

        return (
            <Switch>
                <Route exact path = '/' component = {HomePage}/>
                <Route path = '/auth' component = { AuthPage } />
                <ProtectedRoute path = '/projects' component = { ProjectPage } />
                <Route path = '*' component = { NotFound } />
            </Switch>
        );
    }
}

export default connect(state => ( {
    signedIn: !!state[moduleName].user,
    initializeAppLoaded: state[moduleName].initializeAppLoaded
} ), { signOut, initializeApp }, null, { pure: false })(App);
