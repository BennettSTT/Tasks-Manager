import React, { Component }                                         from 'react';
import { connect }                                                  from "react-redux";
import { moduleName as projectModule, checkAndLoadProjectsForPage } from '../../ducks/projects';
import { moduleName as userModule }                                 from '../../ducks/auth';
import Loader                                                       from "../common/Loader";
import Project                                                      from './Project';
import NotFound                                                     from "../routes/NotFound/NotFound";
import './ProjectsPagination.css';

class ProjectsPagination extends Component {
    componentWillMount() {
        const { checkAndLoadProjectsForPage, login, inArchive} = this.props;
        checkAndLoadProjectsForPage(login, 1, inArchive);
    }

    componentWillReceiveProps({ checkAndLoadProjectsForPage, login, inArchive }) {
        checkAndLoadProjectsForPage(login, 1, inArchive);
    }

    render() {
        if (this.props.loading || !this.props.loaded) {
            return <Loader />;
        }

        return (
            <div className = 'projects-page-container'>
                <ul className='list-group projects-page-body'>
                    { this.getItems() }
                </ul>
            </div>
        );
    }

    getItems() {
        const { projects, login } = this.props;
        if (!projects) {
            return <NotFound />;
        }

        let projectItems = projects.map(id =>
            <li key = { id } className='list-group-item'><Project id = { id } login = { login } /></li>);

        if (projectItems.length === 0) {
            return <NotFound message = 'This user has no projects' />;
        }

        return projectItems;
    }

    // getPaginator() {
    //     const {totalPagesCount} = this.props;
    //
    //     return (<Pager>
    //         <Pager.Item href="#">Previous</Pager.Item>{' '}
    //         <Pager.Item href="#">Next</Pager.Item>
    //     </Pager>)
    // }

}

export default connect((store, { login, inArchive }) => {
    const { projectsUsers } = store[projectModule];

    return {
        totalPagesCount: projectsUsers.getIn([login, 'totalPagesCount']),
        user: store[userModule].get('user'),
        loading: projectsUsers.getIn([login, "pagination", inArchive, 1, 'loading']),
        loaded: projectsUsers.getIn([login, "pagination", inArchive, 1, 'loaded']),
        projects: projectsUsers.getIn([login, 'pagination', inArchive, 1, 'ids'])
    };
}, { checkAndLoadProjectsForPage })(ProjectsPagination);