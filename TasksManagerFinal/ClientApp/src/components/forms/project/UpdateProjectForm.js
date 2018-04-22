import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Button }           from "react-bootstrap";
import { connect }          from "react-redux";
import ProjectField         from "../field/ProjectField";

class UpdateProjectForm extends Component {
    static propTypes = {};

    render() {
        const { handleSubmit } = this.props;
        return (
            <form onSubmit = { handleSubmit }>
                <div>
                    <label>Title</label> <Field name = 'title' component = { ProjectField } />
                </div>
                <br />
                <div>
                    <label>Description</label> <Field name = 'description' component = { ProjectField } />
                </div>
                <br />

                <div>
                    <Button bsStyle = 'success' type = 'submit'>Update</Button>
                </div>
            </form>
        );
    }
}

const validate = ({ title, description }) => {
    const errors = {};

    if (!title) {
        errors.title = 'Title is required';
    } else if (title.split(' ').length > 1) {
        errors.title = "Do not use spaces";
    } else if (title.length > 200) {
        errors.title = "Long title";
    }

    if (description && description.length > 2000) {
        errors.description = "Long description";
    }

    return errors;
};

function mapStateToProps(state, { project: { title, description } }) {
    return {
        initialValues: {
            title: title,
            description: description
        }
    };
}

export default connect(mapStateToProps)(reduxForm({
    form: 'updateProjectForm', validate
})(UpdateProjectForm));
