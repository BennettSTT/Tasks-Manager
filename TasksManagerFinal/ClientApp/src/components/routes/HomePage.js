import React, { Component } from 'react';
import { Link }             from "react-router-dom";
import { moduleName }       from "../../ducks/auth";
import { connect }          from "react-redux";
import './HomePage.css';

class HomePage extends Component {
    static propTypes = {};

    render() {
        return (
            <div className = 'home-page'>
                <h1>Welcome to Tasks Manager</h1>
                <br />
                { this.getBody() }
            </div>
        );
    }

    getBody() {
        const { signedIn, user } = this.props;

        return ( signedIn
            ? <div><h3>Hello, { user.login }</h3><h3>You can go to <strong><Link to = '/projects'>Projects</Link></strong></h3></div>
            : <h3>Please <strong><Link to = '/auth/register'>Register</Link></strong></h3> );
    }
}

export default connect(state => ( {
    user: state[moduleName].user,
    signedIn: !!state[moduleName].user
} ), null, null, { pure: false })(HomePage);
