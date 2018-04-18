import React, { Component } from 'react';
import { Link }             from 'react-router-dom';
import './UnAuthorized.css';

class UnAuthorized extends Component {
    static propTypes = {};

    render() {
        return (
            <div className='unauthorized-container'>
                <h1>Unauthorized, please <Link to = '/auth/sign-in'>Sign In</Link></h1>
            </div>
        );
    }
}

export default UnAuthorized;