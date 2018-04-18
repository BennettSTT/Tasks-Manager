import React, { Component } from 'react';
import { Layout }           from "../Layout";
import './ProjectPage.css'

class ProjectPage extends Component {
    static propTypes = {};

    render() {
        return (
            <Layout>
                <div className='projects-page'>
                    <h1>Projects Page</h1>
                </div>
            </Layout>
        );
    }
}

export default ProjectPage;