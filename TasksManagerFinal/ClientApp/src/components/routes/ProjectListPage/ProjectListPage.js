import React, { Component }                                                from 'react';
import ProjectList                                                         from "../../Project/ProjectList";
import { showArchiveProjects, moduleName as userModule, showOpenProjects } from '../../../ducks/auth';
import { connect }                                                         from 'react-redux';
import { Layout }                                                          from "../../Layout";
import { LinkContainer }                                                   from "react-router-bootstrap";
import { Button, ButtonToolbar }                                           from "react-bootstrap";
import './ProjectListPage.css';

class ProjectListPage extends Component {
    render() {
        const { match, inArchive } = this.props;

        return (
            <Layout>
                <div className='container'>
                    { this.getMenu() } <ProjectList login={ match.params.login } inArchive={ inArchive }/>
                </div>
            </Layout>
        );
    }

    getMenu() {
        const {
            user: { login }, match: { params: { login: matchLogin } },
            showArchiveProjects, showOpenProjects
        } = this.props;

        if (login === matchLogin) {
            return (
                <div className='menu-projects-container'>
                    <ButtonToolbar>
                        <LinkContainer to={ `/new` }>
                            <Button> New project </Button>
                        </LinkContainer>
                        <Button onClick={ showOpenProjects }>Show open projects</Button>
                        <Button onClick={ showArchiveProjects }>Show archive of projects </Button>
                    </ButtonToolbar>
                    <hr/>
                </div>
            );
        }

        return null;
    }
}

export default connect(store => ({
    user: store[userModule].get('user'),
    inArchive: store[userModule].OpenInArchive
}), { showOpenProjects, showArchiveProjects })(ProjectListPage);


