import React, { Component } from 'react'
//import { Route, Redirect } from 'react-router-dom' //REACT-5
import AuthenticationService from './AuthenticationService.js'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import '../../RegisterComponent.css'
import CourseDataService from '../../api/course/CourseDataService.js'



class CreateCourseComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            userId:0,
            showSuccessMessage: false,
            courseTitle: '',
            courseDescription: ''
        }

        // this.handleEmailChange = this.handleEmailChange.bind(this)
        // this.handlePasswordChange = this.handlePasswordChange.bind(this)
        this.handleChange = this.handleChange.bind(this)

        this.onSubmitCreateCourse = this.onSubmitCreateCourse.bind(this)
        this.displayCreateCourseForm = this.displayCreateCourseForm.bind(this)
    }




    handleChange(event) {
        //console.log(this.state);
        this.setState(
            {
                [event.target.name]: event.target.value
            }
        )
    }
    // handlePasswordChange(event){
    //     console.log(event.target.value);
    //     this.setState({password :event.target.value})    
    // }
    render() {
        return (
            <div className='RegisterMain'>
                <h1>Create a new course</h1>
                <div className="container"></div>


                {this.state.showSuccessMessage && <div className="alert alert-success register">Successfully created course {this.state.courseTitle}</div>}

                {this.displayCreateCourseForm()}

            </div>

        )
    }

    componentDidMount() {
        this.setState({ email: AuthenticationService.getLoggedInUserName() }, ()=>{
            console.log("this.state.email : " + this.state.email);
            AuthenticationService.checkIfApplicationUserExists({'email': this.state.email})
            .then(
                response=>{
                    console.log(response.data)
                    this.setState({userId:response.data['id']}, ()=>{
                        console.log(this.state.userId)
                    })
                }
            )
        })
        
    }
    displayCreateCourseForm() {
        let { courseTitle, courseDescription } = this.state

        return (


            <div className='actualForm'>

                <Formik

                    initialValues={{ courseTitle, courseDescription }}
                    onSubmit={this.onSubmitCreateCourse}
                    validateOnBlur={false}
                    validateOnChange={false}
                    // validate={this.validate}
                    enableReinitialize={true}
                >
                    {
                        (props) => (
                            <Form className='registerForm'>
                                <ErrorMessage name="courseTitle" component="div"
                                    className="alert alert-warning" />
                                {/* <ErrorMessage name="inResponseTo" component="div"
            className="alert alert-warning" /> */}




                                <fieldset className="form-group">
                                    <label>Course title</label>
                                    <Field className="form-control" type="text" name="courseTitle" />
                                </fieldset>

                                <fieldset className="form-group">
                                    <label>Course description</label>
                                    <Field className="form-control" type="text" name="courseDescription" />
                                </fieldset>


                                <button className="btn btn-success register" type="submit">Create course</button>
                            </Form>
                        )
                    }
                </Formik>
            </div>



        )
    }

    onSubmitCreateCourse(values) {
        console.log("in submit create course")
        let course = {
            title: values.courseTitle,
            description: values.courseDescription,
            instructorApplicationUserId: this.state.userId
        }

        // console.log(values.registerEmail + "x" + values.registerPassword)
        CourseDataService.createCourse(course
        ).then(
            //When successfully created course
            () => {
                // this.props.navigate("/comments")
                this.setState({
                    courseTitle: values.courseTitle,
                    showSuccessMessage: true
                });

                console.log("Successfully created course " + this.state.courseTitle)

            }



        ).catch(
            error => this.setState({
                successMessage: error.response.data.message
            })
        )

    }

}





export default CreateCourseComponent