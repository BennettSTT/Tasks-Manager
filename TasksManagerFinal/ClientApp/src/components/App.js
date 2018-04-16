import React, { Component }    from 'react';
import { connect }             from 'react-redux';
import { Route }               from 'react-router-dom';
import { moduleName, signOut } from '../ducks/auth';
import AuthPage                from './routes/AuthPage';
import { Link }                from 'react-router-dom';

class App extends Component {

    componentDidMount() {
        console.log('componentDidMount', 'App');
    }

    render() {
        const { signOut, signedIn } = this.props;
        const btn = signedIn
            ? <button onClick = { signOut }>Sign out</button>
            : <Link to = '/auth/signin'>sign in</Link>;

        return (
            <div>
                { btn } <Route path = '/auth' component = { AuthPage } />
            </div>
        );
    }
}

export default connect(state => ( {
    signedIn: !!state[moduleName].user
} ), { signOut }, null, { pure: false })(App);
