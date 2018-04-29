import React from 'react';

function StatusSelectField(props) {
    const { input, placeholder, defaultValue, meta: { touched, error } } = props;
    const errorText = touched && error && <div style = { { color: 'red' } }>{ error }</div>;

    return (
        <div>
            <select { ...input }>
                <option value = { 1 }>Low</option>
                <option value = { 2 }>Medium</option>
                <option value = { 3 }>High</option>
            </select>
            <div>
                { errorText }
            </div>
        </div>

    );
}

export default StatusSelectField;
