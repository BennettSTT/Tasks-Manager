import React, { Component }         from 'react';
import { Nav, NavItem }             from "react-bootstrap";
import { LinkContainer }            from 'react-router-bootstrap';
import { moduleName as userModule } from "../../ducks/auth";
import { connect }                  from "react-redux";
import './MenuProjects.css';

class MenuProjects extends Component{
    render() {
        const { login } = this.props.user;
        return (
            <div className='menu-projects-container'>
                <Nav bsStyle ='tabs'>
                    <LinkContainer to={`/new`} >
                        <NavItem>New project</NavItem>
                    </LinkContainer>

                    <LinkContainer to={`/${login}#open`}>
                        <NavItem>Show open projects</NavItem>
                    </LinkContainer>

                    <LinkContainer to={`/${login}#archive`}>
                        <NavItem>Show archive of projects</NavItem>
                    </LinkContainer>
                </Nav>
            </div>
        );
    }
}

export default connect(store => ( {
    user: store[userModule].get('user')
} ))(MenuProjects);
