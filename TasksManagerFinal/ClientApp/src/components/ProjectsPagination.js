import React, { Component }            from 'react';
import { checkAndLoadProjectsForPage } from "../ducks/projects";
import { connect }                     from "react-redux";

class ProjectsPagination extends Component {

    componentWillMount() {
        this.props.checkAndLoadProjectsForPage(this.props.login, 1/*this.props.page*/);
        // this.props.checkAndLoadCommentsForPage(this.props.page)
    }

    componentWillReceiveProps() {
        // checkAndLoadCommentsForPage(page)
    }

    render() {
        return (
            <div>
                ProjectsPagination
            </div>
        );
    }
}

export default connect(null, { checkAndLoadProjectsForPage })(ProjectsPagination);