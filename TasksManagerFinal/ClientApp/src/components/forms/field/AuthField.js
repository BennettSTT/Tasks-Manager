import React from 'react';

function AuthField(props) {
    const { input, type, meta: { error, touched } } = props;
    const errorText = touched && error && <div style = { { color: 'red' } }>{ error }</div>;

    return (
        <div>
            <input className="form-control" { ...input } type = { type } /> { errorText }
        </div>
    );
}

export default AuthField;