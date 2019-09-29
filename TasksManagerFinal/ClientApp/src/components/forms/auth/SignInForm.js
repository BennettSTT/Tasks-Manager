import React, { Component } from "react";
import { reduxForm, Field } from "redux-form";
import emailValidator       from "email-validator";
import AuthField            from "../field/AuthField";
import { Button }           from "react-bootstrap";

class SignInForm extends Component {
    static propTypes = {};

    render() {
        const { handleSubmit } = this.props;

        return (
            <div>
                <h3>Registration</h3>
                <br/>
                <form onSubmit={ handleSubmit }>
                    <div className="form-group">
                        <label>Login</label>
                        <Field name='login' component={ AuthField } type='login'/>
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <Field name='email' component={ AuthField } type='email'/>
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <Field name='password' component={ AuthField } type='password'/>
                    </div>
                    <br/>
                    <div>
                        <button type='submit' class="btn btn-primary">Submit</button>
                    </div>
                </form>
            </div>
        );
    }
}

const validate = ({ email, password }) => {
    const errors = {};

    if (!email) {
        errors.email = "email is required";
    } else if (/<[a-z][a-z0-9]*>/i.test(email)) {
        errors.title = "Incorrect characters";
    } else if (!emailValidator.validate(email)) errors.email = "invalid email";

    if (!password) {
        errors.password = "password is required";
    } else if (/<[a-z][a-z0-9]*>/i.test(password)) {
        errors.title = "Incorrect characters";
    } else if (password.length < 5) errors.password = "to short";

    return errors;
};

export default reduxForm({
    form: "auth",
    validate
})(SignInForm);