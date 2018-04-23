import React, { Component } from 'react';
import SignInForm           from '../../forms/auth/SignInForm';
import SignUpForm           from '../../forms/auth/SignUpForm';
import { Switch }           from "react-router";
import { Route, NavLink }   from 'react-router-dom';
import { connect }          from 'react-redux';
import { login, register }  from '../../../ducks/auth';
import './AuthPage.css';

class AuthPage extends Component {
    static propTypes = {};

    render() {
        return (
            <div className = 'container'>
                <div className = 'auth-page'>
                    <h1>Auth page</h1>
                    <br />

                    <div className='auth-page-link'>
                        <NavLink to = '/auth/register'>Register</NavLink>
                    </div>

                    <div className='auth-page-link'>
                        <NavLink to = '/auth/login'>Login</NavLink>
                    </div>

                    <Switch>
                        <Route path = '/auth/register' render = { () =>
                        <SignInForm onSubmit = { this.handleSignIn } /> } />

                        <Route path = '/auth/login' render = { () =>
                            <SignUpForm onSubmit = { this.handleSignUp } /> } />
                    </Switch>
                </div>
            </div>
        );
    }

    handleSignIn = ({ email, password, login }) => this.props.register(email, password, login);
    handleSignUp = ({ login, password }) => this.props.login(login, password);
}

export default connect(null, { login, register }, null, { pure: false })(AuthPage);