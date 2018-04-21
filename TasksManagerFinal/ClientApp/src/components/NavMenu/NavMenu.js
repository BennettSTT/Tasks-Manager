import React, { Component }                        from 'react';
import { Button, Glyphicon, Nav, Navbar, NavItem } from "react-bootstrap";
import { LinkContainer }                           from 'react-router-bootstrap';
import { moduleName, signOut }                     from "../../ducks/auth";
import { connect }                                 from "react-redux";
import "./NavMenu.css";

class NavMenu extends Component{
    render() {
        const {signOut, login} = this.props;

        const btn = <Button onClick = { signOut }>Sign out</Button>;

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
                        <LinkContainer to={`/${login}`}>
                            <NavItem>
                                My Project
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
    login: state[moduleName].getIn(['user', 'login']),
} ), { signOut }, null, { pure: false })(NavMenu)
