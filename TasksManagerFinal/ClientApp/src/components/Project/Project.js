import React, { Component } from 'react';
import { PageHeader }       from "react-bootstrap";
import ReactQuill           from 'react-quill';
import './Project.css';

class Project extends Component {
    render() {
        const { project: { title, description, openTasksCount } } = this.props;
        return (
            <div>
                <div className = 'project-tasks-counter'>
                    Open Tasks Count: <strong>{ openTasksCount }</strong>
                </div>
                <hr />
                <div>
                    <div className = 'projects-title'>
                        <PageHeader>
                            { title }
                        </PageHeader>
                    </div>
                    <div className = 'projects-body'>
                        <ReactQuill value = { description } readOnly theme = { null } />
                    </div>
                </div>
            </div>
        );
    }
}

export default Project;