import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import ErrorField           from "../common/ErrorField";

class SignInForm extends Component {
    static propTypes = {};

    render() {
        const { handleSubmit } = this.props;
        return (
            <div>
                <h2>Sign In</h2>
                <form onSubmit = { handleSubmit }>
                    <div>
                        <label>Email</label>
                        <Field name = 'email' component="input" type="email" />
                    </div>
                    <div>
                        <label>Password</label>
                        <Field name = 'password' component="input" type = 'password' />
                    </div>
                    <div>
                        <input type = 'submit' />
                    </div>
                </form>
            </div>
        );
    }
}

export default reduxForm({
    form: 'auth'
})(SignInForm);