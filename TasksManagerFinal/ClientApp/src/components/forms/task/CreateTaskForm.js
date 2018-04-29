import './CreateTaskForm.css';
import React, { Component }      from 'react';
import { reduxForm, Field }      from 'redux-form';
import { Button }                from "react-bootstrap";
import FormControlField          from "../field/FormControlField";
import DatePickerField           from "../field/DatePickerField";
import StatusSelectField         from "../field/StatusSelectField";
import { dueDateParse, getDate } from "../../../utils";
import { connect }               from "react-redux";

class CreateTaskForm extends Component {
    static propTypes = {};

    render() {
        const { handleSubmit } = this.props;
        return (
            <div className = 'create-task-form-container'>
                <form onSubmit = { handleSubmit }>
                    <div className = 'create-task-form-title'>
                        <label>Title</label>
                        <Field name = 'title' component = { FormControlField } />
                    </div>
                    <br />
                    <div className = 'create-task-due-date'>
                        <label>Due Date</label>
                        <Field name = 'dueDate' component = { DatePickerField } />
                    </div>
                    <br />
                    <div className = 'create-task-status'>
                        <label>Status</label>
                        <Field name = 'priority' component = { StatusSelectField } />
                    </div>
                    <div className = 'create-task-button-block'>
                        <div className = 'create-task-button'>
                            <Button onClick = { this.props.addTaskHandler }>Close</Button>
                        </div>
                        <div className = 'create-task-button'>
                            <Button bsStyle = 'success' type = 'submit'>Create</Button>
                        </div>
                    </div>

                </form>
            </div>
        );
    }
}

const validate = ({ title, dueDate, priority }) => {
    const errors = {};

    if (!title) {
        errors.title = 'Title is required';
    } else if (/<[a-z][a-z0-9]*>/i.test(title)) {
        errors.title = "Incorrect characters";
    }
    else if (title.length > 200) {
        errors.title = "Long title";
    }

    const today = getDate();
    const dueD = dueDateParse(dueDate);

    if (dueD < today) {
        errors.dueDate = "The Due Date should not be earlier than the current day";
    }

    if (!dueDate) {
        errors.dueDate = 'Due Date is required';
    }

    if (!priority) {
        errors.status = 'Priority is required';
    }

    return errors;
};

function mapStateToProps(state) {
    return {
        initialValues: { priority: '2' }
    };
}

export default connect(mapStateToProps)(reduxForm({ validate })(CreateTaskForm));
