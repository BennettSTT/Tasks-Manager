import React, { Component } from 'react';
import SignInForm           from '../auth/SignInForm';
import SignUpForm           from '../auth/SignUpForm';
import { Route, NavLink }   from 'react-router-dom';
import { connect }          from 'react-redux';
import { signUp, signIn }   from '../../ducks/auth';
import './AuthPage.css';

class AuthPage extends Component {
    static propTypes = {};

    render() {
        // const { loading } = this.props;
        return (
            <div className = 'container'>
                <div className = 'auth-page'>
                    <h1>Auth page</h1>
                    <br />

                    <div className='auth-page-link'>
                        <NavLink to = '/auth/sing-in'>sign in</NavLink>
                    </div>

                    <div className='auth-page-link'>
                        <NavLink to = '/auth/sign-up'>sign up</NavLink>
                    </div>

                    <Route path = '/auth/sing-in' render = { () =>
                        <SignInForm onSubmit = { this.handleSignIn } /> } />

                    <Route path = '/auth/sign-up' render = { () =>
                        <SignUpForm onSubmit = { this.handleSignUp } /> } />
                </div>
            </div>
        );
    }

    handleSignIn = ({ email, password, login }) => this.props.signIn(email, password, login);
    handleSignUp = ({ login, password }) => this.props.signUp(login, password);
}

export default connect(state => ( {} ), { signUp, signIn })(AuthPage);