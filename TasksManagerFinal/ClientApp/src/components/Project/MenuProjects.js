import React, { Component }         from 'react';
import { Button }                   from "react-bootstrap";
import { moduleName as userModule } from "../../ducks/auth";
import { connect }                  from "react-redux";

class MenuProjects extends Component {
    render() {

        return (
            <div className = 'project-menu-container'>
                <div className = 'projects-btn-group'>
                    <div className = 'projects-btn'>
                        <Button onClick = { () => this.setState({ editProject: !this.state.editProject }) }
                                bsStyle = 'primary'>Edit</Button>
                    </div>

                    <div className = 'projects-btn'>
                        <Button onClick = { () => this.setState({ show: true }) }
                                bsStyle = 'primary'>{ this.titleArchiveButton() }</Button>
                    </div>
                </div>
            </div>
        );
    }

    titleArchiveButton() {
        const { project: { inArchive } } = this.props;
        if (inArchive) return "Open";

        return "Archive";
    }
}

export default connect(store => ( {
    user: store[userModule].get('user')
} ))(MenuProjects);
