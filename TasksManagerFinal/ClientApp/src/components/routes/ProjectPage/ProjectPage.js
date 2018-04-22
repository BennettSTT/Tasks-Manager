import React, { Component }                            from 'react';
import { checkAndLoadProject, projectSelectorFactory } from '../../../ducks/projects';
import { connect }                                     from 'react-redux';
import { Layout }                                      from "../../Layout";
import Project                                         from "../../Project/Project";
import './ProjectPage.css';
import Loader                                          from "../../common/Loader";

class ProjectPage extends Component {

    componentWillMount() {
        const { checkAndLoadProject, match: { params: { login, projectTitle } } } = this.props;
        checkAndLoadProject(login, projectTitle);
    }

    render() {
        const { project } = this.props;
        if (!project) return <Loader />;

        return (
            <Layout>
                <div className = 'container'>
                    <Project project = { project } />
                </div>
            </Layout>
        );
    }
}

export default connect(() => {
    const projectSelector = projectSelectorFactory();

    return (state, ownProps) => {
        return {
            project: projectSelector(state, ownProps)
        };
    }
}, { checkAndLoadProject })(ProjectPage);


