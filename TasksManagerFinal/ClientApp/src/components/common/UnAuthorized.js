import React, { Component } from 'react';
import { Link }             from 'react-router-dom';
import './UnAuthorized.css';

class UnAuthorized extends Component {
    static propTypes = {};

    render() {
        return (
            <div className='unauthorized-container'>
                <h1>Unauthorized, please <Link to = '/auth/register'>Register</Link></h1>
            </div>
        );
    }
}

export default UnAuthorized;