import 'react-datepicker/dist/react-datepicker.css';
import React      from 'react';
import DatePicker from 'react-datepicker';
import moment     from 'moment';

function DatePickerField(props) {
    const { input, placeholder, defaultValue, meta: { touched, error } } = props;
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
}

export default DatePickerField;
