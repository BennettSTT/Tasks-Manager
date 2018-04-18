import React, { Component } from 'react';
import { Link }             from "react-router-dom";
import './HomePage.css';

class HomePage extends Component {
    static propTypes = {};

    render() {
        return (
            <div className='home-page'>
                <h1>Welcome to Tasks Manager</h1>
                <br />
                <h3>Authorized, please <strong><Link to = '/auth/sign-in'>Sign In</Link></strong></h3>
            </div>
        );
    }
}

export default HomePage;
