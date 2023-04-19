import React, { Component } from 'react'
import AuthenticationService from './AuthenticationService.js'
import StudnetsDataService from '../../api/applicationuser/StudentsDataService.js'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import "../../ListFeedbackComponent.css"


class ListStudentsComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            students: [],
            message: null,
            lesson: 1,
            interests: ""
        }
        this.refreshStudents = this.refreshStudents.bind(this)
        this.filterStudents = this.filterStudents.bind(this)
        this.filterStudentsByLesson = this.filterStudentsByLesson.bind(this)
        this.filterStudentsByInterest = this.filterStudentsByInterest.bind(this)
    }


    componentDidMount() {
        console.log("componentDidMount")
        if (this.state.students.length == 0) {
            this.refreshStudents();
        }
    }

    refreshStudents() {
        let username = AuthenticationService.getLoggedInUserName()
        StudnetsDataService.retrieveAllStudents()
            .then(
                response => {
                    this.setState({ students: response.data })
                }
            )
    }

    filterStudents(values){
        if(values.interests.length > 0){
            this.filterStudentsByInterest(values)
        }else{
            this.filterStudentsByLesson(values)
        }
    }

    filterStudentsByInterest(values){
        StudnetsDataService.retrieveAllStudentsForInterest(values.interests)
        .then(
            response => {
                this.setState({ students: response.data, lesson: '', interests: values.interests })
            }
        )
    }

    filterStudentsByLesson(values){
        StudnetsDataService.retrieveAllStudentsForALesson(values.lesson)
        .then(
            response => {
                this.setState({ students: response.data, lesson: values.lesson, interests: '' })
            }
        )
    }

    render() {

        let { lesson, interests} = this.state
        return (

            <div className='filterMain'>
                <h1>Search students</h1>
                <div className='actualFilterForm'>
                <Formik 
                    initialValues={{ lesson, interests }}
                    onSubmit={this.filterStudents}
                    validateOnBlur={false}
                    validateOnChange={false}
                    enableReinitialize={true}
                >
                    {
                        (props) => (
                            <Form className='filterFeedbackForm'>
                                <ErrorMessage name="description" component="div"
                                    className="alert alert-warning" />
                                <fieldset className="form-group">
                                    <label>Filter by interests</label>
                                    <Field className="form-control" type="text" name="interests" />
                                </fieldset>
                                <fieldset className="form-group">
                                    <label>Filter by course ID</label>
                                    <Field className="form-control" type="text" name="lesson" />
                                </fieldset>
                                <button className="btn btn-success filter" type="submit">List students</button>
                            </Form>
                        )
                    }

                </Formik>


                </div>
                {this.state.message && <div className="alert alert-success">{this.state.message}</div>}
                <div className="container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Student name</th>
                                <th>Course ID</th>
                                <th>Student interests</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.students.map(
                                    student =>
                                        <tr key={student.id}>
                                            <td>{student.name}</td>
                                            <td>{student.lessonId}</td>
                                            <td>{student.interests}</td>
                                        </tr>
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

}

export default ListStudentsComponent