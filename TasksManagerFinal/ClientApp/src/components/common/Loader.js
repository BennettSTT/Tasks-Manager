import React from 'react';
import './Loader.css';

function Loader(props) {
    const message = props.message ? props.message : null;
    return (
        <div className = 'loader'>
            <h2>Loading...</h2>
            <h4>{ message }</h4>
        </div>
    );
}

export default Loader;