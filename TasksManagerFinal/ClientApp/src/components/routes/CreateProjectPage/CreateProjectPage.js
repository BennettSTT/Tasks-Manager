import React, { Component } from 'react';
import NewProjectForm       from "../../forms/project/CreateProjectForm";
import './CreateProjectPage.css';
import { createProject }    from "../../../ducks/projects";
import { connect }          from "react-redux";
import { Layout }           from "../../Layout";

class CreateProjectPage extends Component {
    render() {
        return (
            <Layout>
                <div className = 'container'>
                    <NewProjectForm onSubmit = { this.handleSignUp } />
                </div>
            </Layout>
        );
    }

    handleSignUp = ({ title, description }) => this.props.createProject(title, description);
}

export default connect(null, { createProject })(CreateProjectPage);