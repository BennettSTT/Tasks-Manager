import React, { Component }          from 'react';
import { PageHeader } from "react-bootstrap";
import './Project.css';

class Project extends Component {
    render() {
        const { project: { title, description, openTasksCount } } = this.props;
        return (
            <div>
                <div className = 'project-tasks-counter'>
                    Open Tasks Count: <strong>{ openTasksCount }</strong>
                </div>
                <hr />
                <div>
                    <div className = 'projects-title'>
                        <PageHeader>
                            { title }
                        </PageHeader>
                    </div>
                    <div className = 'projects-body'>
                        { description }
                    </div>
                </div>
            </div>
        );
    }

        // return (
        //     <form onSubmit = { handleSubmit }>
        //         <div>
        //             <label>Title</label> <Field name = 'title' component = { ProjectField } />
        //         </div>
        //         <br />
        //         <div>
        //             <label>Description</label> <Field name = 'description' component = { ProjectField } />
        //         </div>
        //         <br />
        //
        //         <div>
        //             <Button bsStyle = 'success' type = 'submit'>Update</Button>
        //         </div>
        //     </form>
    // );
    // };

}

// const validate = ({ title, description }) => {
//     const errors = {};
//
//     if (!title) {
//         errors.title = 'Title is required';
//     } else if (title.split(' ').length > 1) {
//         errors.title = "Do not use spaces";
//     } else if (title.length > 200) {
//         errors.title = "Long title";
//     }
//
//     if (description && description.length > 2000) {
//         errors.description = "Long description";
//     }
//
//     return errors;
// };


// function mapStateToProps(state, { project: { title, description } }) {
//     return {
//         loginUser: state[moduleName].getIn(['user', 'login']),
//         initialValues: {
//             title: title,
//             description: description
//         }
//     };
// }

export default (Project);