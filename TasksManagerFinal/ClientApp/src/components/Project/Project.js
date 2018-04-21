import React, { Component }       from 'react';
import { connect }                from 'react-redux';
import { projectSelectorFactory } from "../../ducks/projects";
import { Link }                   from "react-router-dom";
import { Button }                 from "react-bootstrap";
import { updateProject }          from '../../ducks/projects';
import './Project.css';
import { moduleName }             from "../../ducks/auth";

class Project extends Component {
    render() {
        const { project: { title, description, openTasksCount }, login  } = this.props;

        return (
            <div>
                <div className = 'projects-title'>
                    <h3>
                        <Link to = { `/${login}/${title}` }>{ title }</Link>
                    </h3>
                </div>
                <br />
                <div className = 'projects-body'>
                    <h5>{ description }</h5>
                </div>

                <br />
                <div className = 'projects-btn-tasks'>
                    <p>Open Tasks Count: <strong>{ openTasksCount }</strong></p>
                </div>
                {this.itemsHandler()}
            </div>
        );
    }

    handlerArchiveButton = () => {
        const { updateProject, project } = this.props;
        updateProject(project);
    };

    titleArchiveButton() {
        const { project: { inArchive } } = this.props;
        if (inArchive) return "Open";

        return "Archive";
    }

    itemsHandler() {
        const { login, loginUser } = this.props;
        debugger;
        if (loginUser === login) {
            return ( <div className = 'projects-btn-group'>
                <div className = 'projects-btn'>
                    <Button bsStyle = 'primary'>Edit</Button>
                </div>

                <div className = 'projects-btn'>
                    <Button onClick = { this.handlerArchiveButton } bsStyle = 'primary'>{ this.titleArchiveButton() }</Button>
                </div>
            </div> )
        }
        return null
    }
}


const mapStateToProps = () => {
    const projectSelector = projectSelectorFactory();

    return (state, ownProps) => {
        return {
            project: projectSelector(state, ownProps),
            loginUser: state[moduleName].getIn(['user', 'login'])
        };
    };
};

export default connect(mapStateToProps, { updateProject })(Project);