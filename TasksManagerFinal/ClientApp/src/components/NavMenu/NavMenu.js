import React, { Component }                from 'react';
import { Glyphicon, Nav, Navbar, NavItem } from "react-bootstrap";
import { LinkContainer }                   from 'react-router-bootstrap';
import { moduleName, signOut }             from "../../ducks/auth";
import { connect }                         from "react-redux";
import "./NavMenu.css";
import { Link }                            from "react-router-dom";

class NavMenu extends Component{
    render() {
        const {signOut, signedIn} = this.props;

        const btn = signedIn
            ? <button onClick = { signOut }>Sign out</button>
            : <Link to = '/auth/signin'>sign in</Link>;

        return (
            <Navbar inverse collapseOnSelect>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href="#">Tasks Manager</a>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav>
                        <LinkContainer to={'/projects'}>
                            <NavItem>
                                Projects
                            </NavItem>
                        </LinkContainer>
                    </Nav>
                    <Nav pullRight>
                        <NavItem>
                            {btn}
                        </NavItem>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default connect(state => ( {
    signedIn: !!state[moduleName].user,
} ), { signOut }, null, { pure: false })(NavMenu)
