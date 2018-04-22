import React, { Component }         from 'react';
import { Button, PageHeader }       from "react-bootstrap";
import { moduleName as userModule } from "../../../ducks/auth";
import { connect }                  from "react-redux";
import { reduxForm, Field }         from 'redux-form';
import ProjectField                 from "../field/ProjectField";

class CreateProjectForm extends Component {
    render() {
        const { handleSubmit } = this.props;

        return (
            <div className = 'new-project-page-container'>
                <PageHeader>
                    <small>New project</small>
                </PageHeader>

                <form onSubmit = { handleSubmit }>
                    <div className = 'form-group'>
                        <label className = 'control-label'>Title project</label>
                        <Field name = 'title' component = { ProjectField } />
                    </div>

                    <div className = 'form-group'>
                        <label className = 'control-label'>Description</label>
                        <Field name = 'description' component = { ProjectField } />
                    </div>
                    <br />
                    <div>
                        <Button type = 'submit'>Create</Button>
                    </div>
                </form>
            </div>
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

export default connect(store => ( {
    user: store[userModule].get('user')
} ))(reduxForm({
    form: 'newProject',
    validate
})(CreateProjectForm));