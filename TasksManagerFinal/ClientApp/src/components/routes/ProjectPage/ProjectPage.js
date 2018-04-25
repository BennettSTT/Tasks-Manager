import React, { Component }         from 'react';
import {
    checkAndLoadProject,
    moduleName as projectModule,
    projectSelectorFactory,
    updateProject
}                                   from '../../../ducks/projects';
import { connect }                  from 'react-redux';
import { Layout }                   from "../../Layout";
import Project                      from "../../Project/Project";
import './ProjectPage.css';
import Loader                       from "../../common/Loader";
import { Button, Glyphicon, Modal } from "react-bootstrap";
import { moduleName as authModule } from "../../../ducks/auth";
import UpdateProjectForm            from "../../forms/project/UpdateProjectForm";
import { checkAndLoadTasksProject } from "../../../ducks/tasks";
import { Route, Switch }            from "react-router";
import { NavLink }                  from "react-router-dom";
import NotFound                     from "../NotFound/NotFound";

class ProjectPage extends Component {
    state = {
        editProject: false,
        showModal: false
    };

    componentWillMount() {
        const { checkAndLoadProject, match: { params: { login, projectTitle } } } = this.props;
        checkAndLoadProject(login, projectTitle);
    }

    //#region Project Menu
    projectMenu() {
        const {
            user: { login: userLogin },
            match: { params: { login: matchLogin } },
            project: { inArchive }
        } = this.props;

        if (userLogin !== matchLogin) return null;

        const statusArchive = inArchive ? "Open" : "Archive";
        const statusEditProect = this.state.editProject
            ? <Glyphicon glyph = 'glyphicon glyphicon-remove' />
            : <Glyphicon glyph = 'glyphicon glyphicon-pencil' />;
        return (
            <div className = 'project-menu-container'>
                <div className = 'projects-btn-group'>
                    <div className = 'projects-btn'>
                        <Button onClick = { () => this.setState({ editProject: !this.state.editProject }) }
                        >{ statusEditProect }</Button>
                    </div>

                    <div className = 'projects-btn'>
                        <Button onClick = { () => this.setState({ showModal: true }) }
                                bsStyle = 'primary'>{ statusArchive }</Button>
                    </div>
                </div>
            </div>
        );
    }

    //#endregion

    //#region logic Modal Window
    modalItem() {
        const { project: { inArchive } } = this.props;

        const statusArchive = inArchive ? "Open" : "Archive";
        return (
            <Modal
                show = { this.state.showModal }
                onHide = { this.handleHide }
                container = { this }
                aria-labelledby = 'contained-modal-title'
            > <Modal.Header closeButton>
                <Modal.Title id = 'contained-modal-title'>{ statusArchive } project</Modal.Title> </Modal.Header>

                <Modal.Body> Do you really want to do this?</Modal.Body>

                <Modal.Footer>
                    <Button bsStyle = 'primary' onClick = { this.handlerArchiveButton }>{ statusArchive }</Button>
                    <Button onClick = { this.handleHide }>Close</Button> </Modal.Footer> </Modal>
        );
    }

    handlerArchiveButton = () => {
        const { updateProject, project } = this.props;

        updateProject({
            id: project.id,
            title: project.title,
            description: project.description,
            inArchive: !project.inArchive,
            openTasksCount: project.openTasksCount
        });

        this.setState({ showModal: !this.state.showModal });
    };

    handleHide = () => this.setState({ showModal: false });


    //#endregion

    render() {
        const { project, match: { params: { login, projectTitle } } } = this.props;

        if (this.props.loading || !this.props.loaded) {
            return <Loader />;
        }

        if (!project) return ( <Layout> <NotFound /> </Layout> );

        const content = this.state.editProject
            ? <UpdateProjectForm onSubmit = { this.handleUpdateProject } project = { project } />
            : <Project project = { project } />;

        return (
            <Layout>
                <div className = 'container'>
                    { this.projectMenu() }

                    { content }

                    { this.modalItem() }
                </div>
                <div className = 'auth-page-link'>
                    <NavLink to = { `/${login}/${projectTitle}/tasks` }>View Tasks</NavLink>
                </div>
            </Layout>
        );
    }

    handleUpdateProject = ({ title, description }) => {
        const { project } = this.props;

        this.props.updateProject({
            id: project.id,
            title,
            description,
            inArchive: project.inArchive,
            openTasksCount: project.openTasksCount
        });

        this.setState({ editProject: false });
    };
}

function mapStateToProps() {
    const projectSelector = projectSelectorFactory();

    return (state, ownProps) => {
        const { projectsUsers } = state[projectModule];
        const { match: { params: { login } } } = ownProps;

        return {
            loading: projectsUsers.getIn([login, 'loading']),
            loaded: projectsUsers.getIn([login, 'loaded']),
            user: state[authModule].get('user'),
            project: projectSelector(state, ownProps)
        };
    };
}

export default connect(mapStateToProps, {
    checkAndLoadProject,
    updateProject,
    loadTasksProject: checkAndLoadTasksProject
})(ProjectPage);


