import React           from 'react';
import { FormControl } from "react-bootstrap";

function FormControlField(props) {
    const { input, type, meta: { error, touched } } = props;
    const errorText = touched && error && <div style = { { color: 'red' } }>{ error }</div>;

    return (
        <div>
            <FormControl componentClass="textarea" className='form-control' { ...input } type = { type } /> { errorText }
        </div>
    );
}

export default FormControlField;