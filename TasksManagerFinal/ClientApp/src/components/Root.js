import React, { Component } from 'react';
import App                  from './App';
import store                from '../redux';
import { Provider }         from 'react-redux';
import { ConnectedRouter }  from 'react-router-redux';
import history              from '../history';
import '../config';

export default class Root extends Component {
    render() {
        return (
            <Provider store = { store }>
                <ConnectedRouter history = { history }>
                    <App />
                </ConnectedRouter>
            </Provider>
        );
    }
}
