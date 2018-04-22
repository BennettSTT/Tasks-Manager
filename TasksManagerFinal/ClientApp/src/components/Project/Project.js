import React, { Component }          from 'react';
import { connect }                   from 'react-redux';
import { Link }                      from "react-router-dom";
import { Button, Modal, PageHeader } from "react-bootstrap";
import { updateProject }             from '../../ducks/projects';
import './Project.css';

class Project extends Component {
    state = {
        show: false
    };

    render() {
        // TODO: Не давать редавктировать если это не проектюзера
        const { project: { title, description, openTasksCount } ,login  } = this.props;

        return (
            <div>
                <div className = 'projects-title'>
                    <PageHeader>
                        <Link to = { `/${login}/${title}` }>{ title }</Link>
                        <br/>
                        <small>Open Tasks Count: <strong>{ openTasksCount }</strong></small>
                    </PageHeader>
                </div>
                <div className = 'projects-body'>
                    <h5>{ description }</h5>
                </div>
                { this.itemsHandler() }
                { this.modalItem() }
            </div>
        );
    }

    handleHide = () => {
        this.setState({ show: false });
    };

    modalItem () {
        return(
            <Modal
                show = { this.state.show }
                onHide = { this.handleHide }
                container = { this }
                aria-labelledby="contained-modal-title"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title">
                        { this.titleArchiveButton() } project
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Do you really want to do this?
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle = 'primary' onClick={ this.handlerArchiveButton }>{ this.titleArchiveButton() }</Button>
                    <Button onClick={ this.handleHide }>Close</Button>
                </Modal.Footer>
            </Modal>
        )
    }

    handlerArchiveButton = () => {
        const { updateProject, project } = this.props;
        updateProject(project);

        this.setState({ show: !this.state.show });
    };

    titleArchiveButton() {
        const { project: { inArchive } } = this.props;
        if (inArchive) return "Open";

        return "Archive";
    }

    itemsHandler() {
        const { login, loginUser } = this.props;
        if (loginUser === login) {
            return ( <div className = 'projects-btn-group'>
                <div className = 'projects-btn'>
                    <Button
                            bsStyle = 'primary'

                    >Edit</Button>
                </div>

                <div className = 'projects-btn'>
                    <Button onClick = { () => this.setState({ show: true }) } bsStyle = 'primary'>{ this.titleArchiveButton() }</Button>
                </div>
            </div> );
        }
        return null;
    }
}

export default connect(null, {updateProject})(Project);