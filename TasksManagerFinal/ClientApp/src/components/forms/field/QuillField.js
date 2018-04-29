import 'react-quill/dist/quill.snow.css';
import React      from 'react';
import ReactQuill from 'react-quill';

function QuillField(props) {
    const { input, type, meta: { error, touched } } = props;
    const errorText = touched && error && <div style = { { color: 'red' } }>{ error }</div>;
    return (
        <div>
            <ReactQuill value = { input.value }
                        theme = { 'snow' }{ ...input }
                        onBlur = { () => {} }
                        modules = { {
                            toolbar: [
                                [{ 'header': [1, 2, false] }],
                                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                                ['link', 'image'],
                                ['clean']
                            ]
                        } }
                        formats = { [
                            'header',
                            'bold', 'italic', 'underline', 'strike', 'blockquote',
                            'list', 'bullet', 'indent',
                            'link', 'image'
                        ] }
            /> { errorText }
        </div>
    );
}

export default QuillField;