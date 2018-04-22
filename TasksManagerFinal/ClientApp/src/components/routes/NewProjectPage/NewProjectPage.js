import React, { Component } from 'react';
import NewProjectForm       from "../../Project/NewProjectForm";
import './NewProjectPage.css';
import { createProject }    from "../../../ducks/projects";
import { connect }          from "react-redux";
import { Layout }           from "../../Layout";

class NewProjectPage extends Component {
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

export default connect(null, { createProject })(NewProjectPage);