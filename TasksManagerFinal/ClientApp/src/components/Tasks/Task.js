import './Task.css';
import React, { Component }                                             from 'react';
import { Button, Modal }                                                from "react-bootstrap";
import { checkAndLoadChildrenTask, createTask, deleteTask, updateTask } from "../../ducks/tasks";
import { connect }                                                      from 'react-redux';
import UpdateTaskForm                                                   from "../forms/task/UpdateTaskForm";
import CreateTaskForm                                                   from "../forms/task/CreateTaskForm";

class Task extends Component {
    state = {
        subtask: false,
        edit: false,
        showModal: false,
        addTaskForm: false
    };

    render() {
        const { task } = this.props;
        const child = this.state.subtask && task.children.length !== 0
            ? task.children.map(t => {
                    return <li key={ t.id }>
                        { /* Без понятия почему, но тут нужно передавать контекст */ } { /* Ибо он, почему-то, теряется */ }
                        <Task  { ...this.props } task={ t }/>
                    </li>;
                }
            )
            : null;

        return (
            <div>
                {
                    this.state.edit
                        ? <UpdateTaskForm task={ task }
                                          onSubmit={ this.handleUpdateTask }
                                          editTask={ this.editTask }
                                          key={ task.id }
                                          form={ `updateTaskForm_${task.id}` }/>
                        : this.getTask()
                }

                {
                    this.state.addTaskForm
                        ? <CreateTaskForm key={ task.id }
                                          form={ `createTaskForm_${task.id}` }
                                          onSubmit={ this.handleCreateTask }
                                          addTaskHandler={ this.addTaskHandler }/>
                        : null
                }

                <ul>
                    { child }
                </ul>
            </div>
        );
    }

    addTaskHandler = () => this.setState({ addTaskForm: !this.state.addTaskForm });

    getStatus = (status) => {
        switch (status) {
            case 1:
                return "Created";
            case 2:
                return "InProgress";
            case 3:
                return "Posponded";
            case 4:
                return "Completed";
        }
    };

    getTask = () => {
        const { task } = this.props;
        return (
            <div>
                <div className='task-container'>
                    <div className='task-title'>
                        <h4> { task.title } </h4>
                    </div>
                    <hr/>
                    <div className='task-status'>
                        <p>Status: <strong>{ this.getStatus(task.status) }</strong></p>
                        <p>Priority: <strong>{ this.getPriority(task.priority) }</strong></p>
                    </div>

                    <div className='task-info'>
                        <p>DueDate: { task.dueDate ? task.dueDate : "No information" } </p>
                        <p>CreateDate: { task.createDate ? task.createDate : "No information" } </p>
                        <p>CompleteDate: { task.completeDate ? task.completeDate : "No information" } </p>
                    </div>
                    <hr/>
                    <div className='task-button'>
                        <Button onClick={ this.handleHide } bsStyle='danger'>Delete</Button>
                    </div>

                    <div className='task-button-block'>
                        <div className='task-button'>
                            <Button onClick={ this.completeTask }>Complete task</Button>
                        </div>
                        <div className='task-button'>
                            <Button onClick={ this.viewSubtask }>View subtask</Button>
                        </div>
                        <div className='task-button'>
                            <Button onClick={ this.editTask }>Edit</Button>
                        </div>
                        <div className='task-button'>
                            <Button onClick={ this.addTaskHandler } bsStyle='success'>Add cubtask</Button>
                        </div>
                    </div>
                </div>
                { this.modalItem() }
            </div>
        );
    };

    completeTask = () => {
        const { task, updateTask, login, title: titleProject } = this.props;
        task.status === 4
            ? alert("Task completed")
            : updateTask(login, titleProject, Object.assign({}, task, { status: 4 }));
    };

    handleCreateTask = ({ priority, dueDate, title }) => {
        const { login, title: titleProject, createTask, task, project } = this.props;
        createTask(login, titleProject, Object.assign({}, task, {
            priority,
            dueDate,
            title,
            parentId: task.id,
            projectId: project.id
        }), task.id);

        this.setState({ addTaskForm: !this.state.addTaskForm, subtask: true });
    };

    editTask = () => {
        this.props.task.status === 4
            ? alert("Task completed")
            : this.setState({ edit: !this.state.edit });
    };

    getPriority = (priority) => {
        switch (priority) {
            case 1:
                return "Low";
            case 2:
                return "Medium";
            case 3:
                return "High";
        }
    };

    viewSubtask = () => {
        const { task, checkAndLoadChildrenTask, login, title } = this.props;
        checkAndLoadChildrenTask(login, title, task);

        this.setState({ subtask: !this.state.subtask });
    };

    handleUpdateTask = ({ priority, dueDate, title }) => {
        const { task, updateTask, login, title: titleProject } = this.props;

        updateTask(login, titleProject, Object.assign({}, task, { priority, dueDate, title }));
        this.setState({ edit: !this.state.edit });
    };

    //#region Modal window
    modalItem() {
        return (
            <Modal
                show={ this.state.showModal }
                onHide={ this.handleHide }
                container={ this }
                aria-labelledby='contained-modal-title'
            >
                <Modal.Header closeButton>
                    <Modal.Title id='contained-modal-title'>Delete task</Modal.Title>
                </Modal.Header>

                <Modal.Body> Do you really want to do this?</Modal.Body>

                <Modal.Footer>
                    <Button bsStyle='danger' onClick={ this.deleteNode }>Delete</Button>
                    <Button onClick={ this.handleHide }>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }

    deleteNode = () => {
        const { login, task, title, deleteTask } = this.props;
        deleteTask(login, title, task);

        this.handleHide();
    };

    handleHide = () => this.setState({ showModal: !this.state.showModal });
    //#endregion
}

export default connect(null, {
    checkAndLoadChildrenTask,
    deleteTask,
    updateTask,
    createTask
}, null, { pure: false })(Task);