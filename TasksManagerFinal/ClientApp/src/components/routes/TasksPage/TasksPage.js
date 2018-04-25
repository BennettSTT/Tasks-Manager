import React, { Component } from 'react';
import {
    checkAndLoadTasksProject, moduleName as tasksModule
} from "../../../ducks/tasks";
import { checkAndLoadProject, projectSelectorFactory } from '../../../ducks/projects';
import { connect } from 'react-redux';
import Loader from "../../common/Loader";
import { Layout } from "../../Layout";
import { Button, PageHeader } from "react-bootstrap";
import Task from "../../Tasks/Task";
import './TasksPage.css';

class TasksPage extends Component {
    static propTypes = {};

    componentWillMount() {
        const { checkAndLoadTasksProject, checkAndLoadProject, match: { params: { login, projectTitle } } } = this.props;
        checkAndLoadTasksProject(login, projectTitle);
        checkAndLoadProject(login, projectTitle);
    }

    render() {
        if (!this.props.loadedTasks || this.props.loadingTasks || !this.props.project) {
            return <Loader/>;
        }

        const { tasks, project, match: { params: { login, projectTitle: title } } } = this.props;

        const items = tasks.map(task =>
            <li key = { task.id } className = 'task-item'>
                <Task task = { task } login = { login } title = { title } />
            </li>
        );

        return (
            <Layout>
                <div className = 'container tasks-page-container'>
                    <PageHeader>
                        { project.title }
                    </PageHeader>
                    <p>{ project.description }</p>
                    <br /> <br />
                    <div className = 'tasks-page-menu'>
                        <div className = 'tasks-page-menu-btn'>
                            <Button bsStyle = 'success'>Add task in project</Button>
                        </div>
                    </div>

                    <ul className = 'list-group'>
                        { items }
                    </ul>
                </div>
            </Layout>
        );
    }
}

function mapStateToProps() {
    const projectSelector = projectSelectorFactory();

    return (state, ownProps) => {
        const { match: { params: { login, projectTitle } } } = ownProps;
        return {
            loadingTasks: state[tasksModule].getIn(["projectsUsers", login, projectTitle, 'loading']),
            loadedTasks: state[tasksModule].getIn(["projectsUsers", login, projectTitle, 'loaded']),
            tasks: state[tasksModule].getIn(["projectsUsers", login, projectTitle, "tasks"]),
            project: projectSelector(state, ownProps)
        };
    };
}

export default connect(mapStateToProps, {
    checkAndLoadTasksProject,
    checkAndLoadProject
}, null, { pure: false })(TasksPage);
