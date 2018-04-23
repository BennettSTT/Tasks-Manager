import React, { Component }                                         from 'react';
import { connect }                                                  from "react-redux";
import { moduleName as projectModule, checkAndLoadProjectsForPage } from '../../ducks/projects';
import { moduleName as userModule }                                 from '../../ducks/auth';
import Loader                                                       from "../common/Loader";
import NotFound                                                     from "../routes/NotFound/NotFound";
import { mapToArr }                                                 from "../../utils";
import { Link }                                                     from "react-router-dom";
import './ProjectList.css';

class ProjectList extends Component {
    componentWillMount() {
        const { checkAndLoadProjectsForPage, login, inArchive } = this.props;
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
                <ul className = 'list-group projects-page-body'>
                    { this.getItems() }
                </ul>
            </div>
        );
    }

    getDescription = (project) => {
        const MAX_LENGTH_DESCRIPTION = 40;

        const description = project.get('description');
        let str = description.substring(0, MAX_LENGTH_DESCRIPTION + 1);

        if (description.length > MAX_LENGTH_DESCRIPTION) str = `${str}...`;

        return str;
    };

    getItems() {
        const { projects, login, inArchive } = this.props;

        if (!projects) {
            return <NotFound message = 'This user has no projects'/>;
        }

        let projectFilter = mapToArr(projects)
            .filter(project => project.get('inArchive') === inArchive);

        if (!projectFilter) {
            return <NotFound />;
        }

        let projectItems = projectFilter
            .map(project =>
                <li key = { project.get('id') } className = 'list-group-item'>
                    <h4>
                        <Link to = { `/${login}/${project.get('title')}` }>{ project.get('title') }</Link>
                    </h4>
                    <p> { this.getDescription(project) } </p>
                </li>
            );


        if (projectItems.length === 0) {
            return <NotFound message = 'This user has no projects' />;
        }

        return projectItems;
    }
}

export default connect((store, { login }) => {
    const { projectsUsers } = store[projectModule];

    return {
        totalPagesCount: projectsUsers.getIn([login, 'totalPagesCount']),
        user: store[userModule].get('user'),
        loading: projectsUsers.getIn([login, 'loading']),
        loaded: projectsUsers.getIn([login, 'loaded']),
        projects: projectsUsers.getIn([login, 'entities'])
    };
}, { checkAndLoadProjectsForPage })(ProjectList);