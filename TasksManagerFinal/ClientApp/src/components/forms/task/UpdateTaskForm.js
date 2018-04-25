import React, { Component }      from 'react';
import { reduxForm, Field }      from 'redux-form';
import { Button }                from "react-bootstrap";
import { connect }               from "react-redux";
import ProjectField              from "../field/ProjectField";
import DatePicker                from 'react-datepicker';
import moment                    from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import './UpdateTaskForm.css';
import { dueDateParse, getDate } from "../../../utils";

class UpdateTaskForm extends Component {
    static propTypes = {};

    constructor(props) {
        super(props);
        this.state = {
            startDate: moment()
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(date) {
        this.setState({
            startDate: date
        });
    }

    render() {
        const { handleSubmit } = this.props;
        return (
            <div className = 'update-task-form-container'>
                <form onSubmit = { handleSubmit }>
                    <div className = 'update-task-form-title'>
                        <label>Title</label> <Field name = 'title' component = { ProjectField } />
                    </div>
                    <br />
                    <div className = 'update-task-due-date'>
                        <label>Due Date</label> <Field name = 'dueDate' component = { renderDatePicker } />
                    </div>
                    <br />
                    <div className = 'update-task-status'>
                        <label>Status</label>
                        <div>
                            <Field name = 'status' component = { renderSelect } options = { 1 } />
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

const renderDatePicker = ({ input, placeholder, defaultValue, meta: { touched, error } }) => {
    const errorText = touched && error && <div style = { { color: 'red' } }>{ error }</div>;

    return (
        <div>
            <DatePicker { ...input }
                        dateForm = 'MM/DD/YYYY'
                        selected = { input.value ? moment(input.value) : null }
                        isClearable = { true } />
            <div>
                { errorText }
            </div>
        </div>
    );
};

const renderSelect = ({ input, placeholder, defaultValue, meta: { touched, error } }) => {
    const errorText = touched && error && <div style = { { color: 'red' } }>{ error }</div>;

    return (
        <div>
            <select { ...input }>
                <option value = { 1 }>Created</option>
                <option value = { 2 }>InProgress</option>
                <option value = { 3 }>Posponded</option>
                <option value = { 4 }>Completed</option>
            </select>
            <div>
                { errorText }
            </div>
        </div>

    );
};


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

    if (dueD <= today) {
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
