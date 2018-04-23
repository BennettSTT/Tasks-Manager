import React, { Component } from 'react';
import { connect }          from "react-redux";
import Loader               from "../common/Loader";
import './TaskList.css';

class TaskList extends Component {
    // componentWillMount() {
    //     const { checkAndLoadProjectsForPage, login, inArchive } = this.props;
    //     checkAndLoadProjectsForPage(login, 1, inArchive);
    // }
    //
    // componentWillReceiveProps({ checkAndLoadProjectsForPage, login, inArchive }) {
    //     checkAndLoadProjectsForPage(login, 1, inArchive);
    // }

    render() {
        if (this.props.loading || !this.props.loaded) {
            return <Loader />;
        }

        return (
            <div className = 'projects-page-container'>
                <ul className = 'list-group projects-page-body'>
                    { this.getItems() }
                </ul>
            </div>
        );
    }
}

export default connect(null)(TaskList);