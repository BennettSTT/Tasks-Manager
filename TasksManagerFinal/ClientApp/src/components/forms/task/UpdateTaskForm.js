import React, { Component }      from 'react';
import { reduxForm, Field }      from 'redux-form';
import { Button }                from "react-bootstrap";
import { connect }               from "react-redux";
import FormControlField          from "../field/FormControlField";
import DatePickerField           from "../field/DatePickerField";
import StatusSelectField         from "../field/StatusSelectField";
import { dueDateParse, getDate } from "../../../utils";
import './UpdateTaskForm.css';

class UpdateTaskForm extends Component {
    static propTypes = {};

    render() {
        const { handleSubmit } = this.props;
        return (
            <div className = 'update-task-form-container'>
                <form onSubmit = { handleSubmit }>
                    <div className = 'update-task-form-title'>
                        <label>Title</label> <Field name = 'title' component = { FormControlField } />
                    </div>
                    <br />
                    <div className = 'update-task-due-date'>
                        <label>Due Date</label> <Field name = 'dueDate' component = { DatePickerField } />
                    </div>
                    <br />
                    <div className = 'update-task-status'>
                        <label>Status</label>
                        <div>
                            <Field name = 'status' component = { StatusSelectField } options = { 1 } />
                        </div>
                    </div>
                    <div className = 'update-task-button-block'>
                        <div className = 'update-task-button'>
                            <Button onClick = { this.props.editTask }>Close edit</Button>
                        </div>
                        <div className = 'update-task-button'>
                            <Button bsStyle = 'success' type = 'submit'>Update</Button>
                        </div>
                    </div>

                </form>
            </div>
        );
    }
}

const validate = ({ title, dueDate, status }) => {
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

    if (!status) {
        errors.status = 'Status is required';
    }

    return errors;
};

function mapStateToProps(state, { task: { title, createDate, dueDate, status } }) {
    return {
        initialValues: { title, createDate, dueDate, status }
    };
}

export default connect(mapStateToProps)(reduxForm({ validate })(UpdateTaskForm));
