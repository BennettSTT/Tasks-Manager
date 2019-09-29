import React, { Component }            from 'react';
import SignInForm                      from '../../forms/auth/SignInForm';
import SignUpForm                      from '../../forms/auth/SignUpForm';
import { Switch }                      from "react-router";
import { Route, NavLink }              from 'react-router-dom';
import { connect }                     from 'react-redux';
import { login, moduleName, register } from '../../../ducks/auth';
import './AuthPage.css';

class AuthPage extends Component {
    static propTypes = {};

    render() {
        const { error } = this.props;
        const messageError = error ? error.message : null;

        return (
            <div className='container' style={{width: "450px"}}>
                <div className='auth-page'>
                    <br/>
                    <div className='auth-page-link'>
                        <NavLink to='/auth/register'>Register</NavLink>
                    </div>

                    <div className='auth-page-link'>
                        <NavLink to='/auth/login'>Login</NavLink>
                    </div>
                    <br/>
                    <hr/>

                    <Switch>
                        <Route path='/auth/register' render={ () =>
                            <SignInForm onSubmit={ this.handleSignIn }/> }/>

                        <Route path='/auth/login' render={ () =>
                            <SignUpForm onSubmit={ this.handleSignUp }/> }/>
                    </Switch>

                    <br/>

                    <div style={ { color: "red" } }>
                        { messageError }
                    </div>
                </div>
            </div>
        );
    }

    handleSignIn = ({ email, password, login }) => this.props.register(email, password, login);
    handleSignUp = ({ login, password }) => this.props.login(login, password);
}

export default connect(state => ({
    error: state[moduleName].getIn(['error'])
}), { login, register }, null, { pure: false })(AuthPage);