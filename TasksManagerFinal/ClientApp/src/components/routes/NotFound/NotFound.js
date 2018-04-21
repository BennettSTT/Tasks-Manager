import React from 'react';
import './NotFound.css'

function NotFound(props) {

    let { message = "Not Found"} = props;

    return (
        <div className = 'not-found-container'>
            <h1>{ message }</h1>
        </div>
    );
}

export default NotFound;