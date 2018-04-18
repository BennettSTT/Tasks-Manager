import React, { Component }                from 'react';
import { Glyphicon, Nav, Navbar, NavItem } from "react-bootstrap";
import { LinkContainer }                   from 'react-router-bootstrap';
import { moduleName, signOut }             from "../../ducks/auth";
import { connect }                         from "react-redux";
import "./NavMenu.css";

class NavMenu extends Component{
    render() {
        const {signOut} = this.props;

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
                                <Glyphicon glyph='home' /> Home
                            </NavItem>
                        </LinkContainer>
                    </Nav>
                    <Nav pullRight>
                        <NavItem>
                            <button onClick={signOut}>sing Out</button>
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
