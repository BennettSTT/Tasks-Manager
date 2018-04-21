import React, { Component }                                                from 'react';
import ProjectsPagination                                                  from "../../Project/ProjectsPagination";
import { showArchiveProjects, moduleName as userModule, showOpenProjects } from '../../../ducks/auth';
import { connect }                                                         from 'react-redux';
import { Layout }                                                          from "../../Layout";
import { LinkContainer }                                                   from "react-router-bootstrap";
import { Button, ButtonToolbar, Nav, Navbar, NavItem }                     from "react-bootstrap";
import { Redirect }                                                        from 'react-router';
import './ProjectsPage.css';

class ProjectsPage extends Component {
    render() {
        const { match, inArchive } = this.props;

        return (
            <Layout>
                <div className='container'>
                    { this.getMenu() }
                    <ProjectsPagination login = { match.params.login } inArchive = {inArchive} />
                </div>
            </Layout>
        );
    }

    getMenu () {
        const { user: { login }, match: { params: { login: matchLogin } },
            showArchiveProjects, showOpenProjects } = this.props;

        if (login === matchLogin) {
            return (
                <div className='menu-projects-container'>
                        <Nav bsStyle ='tabs'>
                            <LinkContainer to={`/new`} >
                                <NavItem>New project</NavItem>
                            </LinkContainer>

                            <ButtonToolbar>
                                <Button onClick={showOpenProjects}>Show open projects</Button>
                                <Button onClick={showArchiveProjects}>Show archive of projects </Button>
                            </ButtonToolbar>
                        </Nav>
                </div>
            );
        }

        return null;
    }
}

export default connect(store => ({
    user: store[userModule].get('user'),
    inArchive: store[userModule].OpenInArchive
}), {showOpenProjects, showArchiveProjects})(ProjectsPage);


