import React, { Component }           from 'react';
import SignInForm                     from '../auth/SignInForm';
import SignUpForm                     from '../auth/SignUpForm';
import { Route, NavLink }             from 'react-router-dom';
import { connect }                    from 'react-redux';
import { signUp, signIn, moduleName } from '../../ducks/auth';
import Loader                         from '../common/Loader';

class AuthPage extends Component {
    static propTypes = {};

    render() {
        const { loading } = this.props;
        return (
            <div>
                <h1>Auth page</h1>
                <NavLink to = '/auth/sing-in' activeStyle = { { color: 'red' } }>sign in</NavLink>
                <NavLink to = '/auth/sign-up' activeStyle = { { color: 'red' } }>sign up</NavLink>

                <Route path = '/auth/sing-in' render = { () =>
                    <SignInForm onSubmit = { this.handleSignIn } /> } />

                <Route path = '/auth/sign-up' render = { () =>
                    <SignUpForm onSubmit = { this.handleSignUp } /> } /> { loading && <Loader /> }
            </div>
        );
    }

    handleSignIn = ({ email, password, login }) => this.props.signIn(email, password, login);
    handleSignUp = ({ login, password }) => this.props.signUp(login, password);
}

export default connect(state => ( {
    loading: state[moduleName].loading
} ), { signUp, signIn })(AuthPage);