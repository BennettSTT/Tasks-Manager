import React, { Component }    from "react";
import { moduleName, signOut } from "../../ducks/auth";
import { connect }             from "react-redux";
import "./NavMenu.css";

class NavMenu extends Component {
    render() {
        const { signOut, login } = this.props;

        return (
            <div className='container'>
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <a className="navbar-brand" href="#">Tasks Manager</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse"
                            data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                            aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"/>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item active">
                                <a className="nav-link" href={ `/${ login }` }>My Project</a>
                            </li>
                        </ul>
                        <span className="navbar-text">
                        <a href="#" onClick={ signOut }>Sign out</a>
                    </span>
                    </div>
                </nav>
            </div>
        );
    }
}

export default connect(state => ({
    login: state[moduleName].getIn(["user", "login"])
}), { signOut }, null, { pure: false })(NavMenu);
