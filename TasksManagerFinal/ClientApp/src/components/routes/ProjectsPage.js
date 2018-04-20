import React from 'react';
import './ProjectsPage.css';
import {Redirect, Route}    from 'react-router-dom'
import ProjectsPagination   from "../ProjectsPagination";

function ProjectsPage({match}) {
    // if (match.isExact)  {
    // }
    // return <Redirect to = '/' />
    return <Route path = '/:login' render = {getProjectsPaginator}/>
}

function getProjectsPaginator({match}) {
    return <ProjectsPagination login = {match.params.login}/>
}

// class ProjectsPage extends Component {
//     static propTypes = {};
//
//     render() {
//         const { match } = this.props;
//
//         debugger;
//
//         return (
//             <Layout>
//                 <div className = 'projects-page'>
//                     <h1>Projects Page</h1>
//                 </div>
//             </Layout>
//         );
//     }
// }

export default ProjectsPage;