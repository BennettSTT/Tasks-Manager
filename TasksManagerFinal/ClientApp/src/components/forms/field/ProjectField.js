import React           from 'react';
import { FormControl } from "react-bootstrap";

function ProjectField(props) {
    const { input, type, meta: { error, touched } } = props;
    const errorText = touched && error && <div style = { { color: 'red' } }>{ error }</div>;

    return (
        <div>
            <FormControl componentClass="textarea" className='form-control' { ...input } type = { type } /> { errorText }
        </div>
    );
}

ProjectField.propTypes = {};

export default ProjectField;