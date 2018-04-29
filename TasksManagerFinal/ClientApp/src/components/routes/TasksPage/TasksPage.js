import './TasksPage.css';
import React, { Component }                                                from 'react';
import ReactQuill                                                          from 'react-quill';
import { checkAndLoadTasksProject, createTask, moduleName as tasksModule } from "../../../ducks/tasks";
import { checkAndLoadProject, projectSelectorFactory }                     from '../../../ducks/projects';
import { connect }                                                         from 'react-redux';
import Loader                                                              from "../../common/Loader";
import { Layout }                                                          from "../../Layout";
import { Button, PageHeader }                                              from "react-bootstrap";
import Task                                                                from "../../Tasks/Task";
import CreateTaskForm                                                      from "../../forms/task/CreateTaskForm";

class TasksPage extends Component {
    static propTypes = {};

    state = {
        addRootTaskForm: false
    };

    componentWillMount() {
        const { checkAndLoadTasksProject, checkAndLoadProject, match: { params: { login, projectTitle } } } = this.props;
        checkAndLoadTasksProject(login, projectTitle);
        checkAndLoadProject(login, projectTitle);
    }

    render() {
        if (!this.props.loadedTasks || this.props.loadingTasks || !this.props.project) {
            return <Loader />;
        }

        const { tasks, project, match: { params: { login, projectTitle: title } } } = this.props;
        const items = tasks.map(task =>
            <li key = { task.id } className = 'task-item'>
                <Task task = { task } login = { login } title = { title } project = { project } />
            </li>
        );

        const form = this.state.addRootTaskForm
            ? <CreateTaskForm
                form = { `createTaskForm_Root` }
                addTaskHandler = { this.addRootTaskHandler }
                onSubmit = { this.handleCreateTask }
            />
            : null;

        return (
            <Layout>
                <div className = 'container tasks-page-container'>
                    <PageHeader>
                        { project.title }
                    </PageHeader>
                    <ReactQuill value = { project.description } readOnly theme = { null } />
                    <br /> <br />
                    <div className = 'tasks-page-menu'>
                        <div className = 'tasks-page-menu-btn'>
                            <Button
                                onClick = { this.addRootTaskHandler }
                                bsStyle = 'success'
                            >Add task in project</Button>
                        </div>
                    </div>

                    { form }

                    <ul className = 'list-group'>
                        { items }
                    </ul>
                </div>
            </Layout>
        );
    }

    addRootTaskHandler = () => this.setState({ addRootTaskForm: !this.state.addRootTaskForm });

    handleCreateTask = ({ priority, dueDate, title }) => {
        const { match: { params: { login, projectTitle } }, project, createTask } = this.props;

        createTask(login, projectTitle, {
            title,
            priority,
            dueDate,
            projectId: project.id
        });
        this.setState({ addRootTaskForm: !this.state.addRootTaskForm });
    };
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
    checkAndLoadProject,
    createTask
}, null, { pure: false })(TasksPage);
