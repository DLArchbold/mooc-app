import React, { Component } from 'react'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import moment from 'moment/moment'

import AuthenticationService from './AuthenticationService'
import CommentDataService from '../../api/comment/CommentDataService.js'
import CourseDataService from '../../api/course/CourseDataService'
import EnrolledDataService from '../../api/enrolled/EnrolledDataService'
import LessonDataService from '../../api/lesson/LessonDataService'
import { useHistory, useLocation } from 'react-router-dom';
class CourseComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            courseId: this.props.params.courseId,
            instructorId: this.props.params.instructorId,
            fromListCourseComponent: "",
            description: "",
            course: {},
            enrolled: false,
            enrolledId: "",
            instructorName: "",
            username: AuthenticationService.getLoggedInUserName(),
            relatedLessons: []
        }

        // this.onSubmit = this.onSubmit.bind(this)
        // this.validate = this.validate.bind(this)
    }


    componentDidMount() {
        // var id = this.state.courseId;
        // id = id.substring(0, id.indexOf("%"))

        let x = window.location.href.indexOf("viewFromListCourseComponent") === -1;
        // console.log("window.location.href: "+ x)
        if (x === false) {
            //viewing from ListCourseComponent, do not display buttons to view lessons
            this.setState({
                fromListCourseComponent: true
            })
        } else {
            this.setState({
                fromListCourseComponent: false
            })
        }
        console.log("this.state.props.params.instructorId: " + this.props.params.instructorId)

        CourseDataService.retrieveCourseByCourseId(this.state.courseId)
            .then(
                (response) => {


                    // let instructorName = AuthenticationService.findUserByApplicationUserId(response.data['instructor_application_user_id'])

                    this.setState({
                        course: response.data,

                    }, () => {
                        console.log("this.state.course" + " " + JSON.stringify(this.state.course))
                        let courseInsturctorId = response.data['instructorApplicationUserId']
                        let courseInstructor = AuthenticationService.findUserByApplicationUserId(courseInsturctorId)
                            .then(
                                response => {
                                    this.setState({
                                        instructorName: response.data['email']
                                    }, () => {
                                        console.log("this.state.instructorName : " + this.state.instructorName)
                                        this.getAndDisplayRelatedLessons();
                                    })
                                }
                            )


                    })

                    let enrolled = {
                        courseId: this.state.courseId,
                        username: this.state.username
                    }
                    EnrolledDataService.retrieveEnrolledByCourseIdAndUsername(enrolled)
                        .then(
                            response => {


                                if (response.data.length == 0) {
                                    // console.log("1 " + response.data)
                                    this.setState({ enrolled: false })
                                } else {
                                    // console.log("2 " + response.data)
                                    // console.log(JSON.stringify(response.data))
                                    this.setState({
                                        enrolled: true,
                                        enrolledId: response.data[0]['id']
                                    }, () => {
                                        console.log("enrolledId: " + this.state.enrolledId)
                                    })
                                }

                            }
                        )


                }
            )


    }

    enrollInCourse(courseId) {
        var enrolled = {
            username: AuthenticationService.getLoggedInUserName(),
            courseId: courseId
        }

        EnrolledDataService.createEnrolled(enrolled)
            .then(
                response => {
                    this.setState({
                        enrolled: true,
                        enrolledId: response.data['id']
                    }, () => {
                        console.log(JSON.stringify(response.data))
                    })
                }
            )
    }

    unEnrollInCourse(courseId) {
        var enrolled = {
            username: AuthenticationService.getLoggedInUserName(),
            courseId: courseId
        }

        EnrolledDataService.deleteEnrolled(this.state.enrolledId)
            .then(
                response => {
                    this.setState({ enrolled: false }, () => {

                    })
                }
            )
    }

    getAndDisplayRelatedLessons() {

        // return (
        //     <>

        //         <h2>Lessons in this course</h2>

        //     </>

        // )


        if (this.state.enrolled === true) {
            LessonDataService.retrieveLessonsByCourseId(this.state.courseId)
                .then(
                    response => {


                        if (response !== undefined) {
                            console.log('getAndDisplayRelatedLessons-true')

                            this.setState({ relatedLessons: response.data })

                        } else {
                            console.log('getAndDisplayRelatedLessons-false')
                        }
                    }
                )

        }
    }

    goToLesson(lessonId) {
        this.props.navigate(`/lesson/${lessonId}`)
    }

    render() {
        return (
            <>
                <h2>Course Title</h2>
                {this.state.course['title']}
                <h2>Course description</h2>
                {this.state.course['description']}

                {/* Only display buttons to lessons if navigating from /profilepage and not /listallcourses */}
                {(this.state.relatedLessons !== [] && this.state.fromListCourseComponent == false) && (<h2>Related lessons</h2>)}
                {
                    (this.state.fromListCourseComponent === false) &&
                    (this.state.relatedLessons.map(
                        relatedLesson =>
                            <>
                                <button className="btn btn-info" onClick={() => this.goToLesson(relatedLesson.id)}>Lesson number of course: {relatedLesson.lessonNumber}<br></br> {relatedLesson.description}</button>
                                <br></br>
                                <br></br>
                            </>


                    ))


                }
                <h2>Instructor</h2>
                {this.state.instructorName}
                <br></br>
                <br></br>
                {(!this.state.enrolled && this.state.instructorId === undefined) && (<button className="btn btn-success" onClick={() => this.enrollInCourse(this.state.courseId)}>Enroll</button>)}
                {(this.state.enrolled && this.state.instructorId === undefined) && (<button className="btn btn-danger" onClick={() => this.unEnrollInCourse(this.state.courseId)}>Un-enroll</button>)}
                <br></br>
                <br></br>
                {(this.state.enrolled && this.state.instructorId === undefined) && <div className="alert alert-success register">Already enrolled previously   </div>}



            </>
        );
    }

}
//     //When Updating(PUT) or Creating(POST) comments
//     onSubmit(values) {
//         console.log("in onSubmit")


//         console.log("state.id " + this.state.id);
//         if (this.state.id == -1) {
//             console.log("in create " + AuthenticationService.getLoggedInUserName())

//             CommentDataService.createComment(this.state.username, {
//                 //Use state values for those which are carried over from ListComments
//                 //Use values if obtained from Formik.
//                 description: values.description,
//                 urgencyLevel: 3,
//                 inResponseTo: values.inResponseTo,
//                 targetDate: this.state.targetDate,
//                 username: AuthenticationService.getLoggedInUserName(),
//                 lessonId: values.lessonId
//             }).then(
//                 //When successfully added redirect user to list all Comments
//                 () => {
//                     this.props.navigate("/comments")
//                 }

//             )
//         } else {
//             console.log("in update")
//             CommentDataService.updateComment(this.state.username, this.state.id, {
//                 //Use state values for those which are carried over from ListComments
//                 //Use values. if obtained from Formik.
//                 //
//                 id: this.state.id,
//                 description: values.description,
//                 inResponseTo: values.inResponseTo,
//                 targetDate: this.state.targetDate,
//                 username: AuthenticationService.getLoggedInUserName
//             }).then(
//                 //When successfully update redirect user to list all Comments
//                 () => {
//                     this.props.navigate("/comments")
//                 }

//             )
//         }

//     }

//     componentDidMount() {

//         this.setState({
//             username: AuthenticationService.getLoggedInUserName()
//         })
//         // console.log("in componentDidMount")
//         //If it's adding a Comment then no need retrieve
//         if (this.state.id == -1) {
//             //remember to use this.props.navigate(`/comments/${id}`) when navigating from elsewhere since 
//             //ID will be in this.state will be treated as string "-1" instead of integer -1. Use only ==
//             //instead of === operator.
//             // console.log("in CommentComponent.componentDidMount(), State id is " + this.state.id  )
//             return
//         }

//         let retrievedUsername = AuthenticationService.getLoggedInUserName()
//         CommentDataService.retrieveComment(retrievedUsername, this.state.id)
//             .then(
//                 response => this.setState({
//                     description: response.data.description,
//                     inResponseTo: response.data.inResponseTo,
//                     username: retrievedUsername,
//                     lessonId: response.data.lessonId
//                 }
//                 ))


//     }

//     //Validation on form fields
//     validate(values) {
//         let errors = {}
//         if (!values.description) {
//             errors.description = "Enter a description"
//         } else if (values.description.length < 5) {
//             errors.description = "Enter at least 5 characters in description"
//         }

//         //IMPORTANT!!!!!!!!!!!!!!!!!
//         //DO CHECK FOR NUMBERS FOR INRESPONSETO FIELD


//         //
//         // if (values.inResponseTo.length < 10) {
//         //     errors.inResponseTo = "Enter a valid name of person that you're responding to"

//         // }


//         return errors
//     }

//     render() {
//         //unpacking feature in javascript, let keys equal to dict name and it will unpack to assign 
//         //keys to values individually automatically
//         let { description, inResponseTo } = this.state

//         return (
//             <div>
//                 <h1>Comment</h1>
//                 <div className="container">
//                     <Formik
//                         initialValues={{ description, inResponseTo }}
//                         onSubmit={this.onSubmit}
//                         validateOnBlur={false}
//                         validateOnChange={false}
//                         validate={this.validate}
//                         enableReinitialize={true}
//                     >
//                         {
//                             (props) => (
//                                 <Form>
//                                     <ErrorMessage name="description" component="div"
//                                         className="alert alert-warning" />
//                                     <ErrorMessage name="inResponseTo" component="div"
//                                         className="alert alert-warning" />


//                                     <fieldset className="form-group">
//                                         <label>Description</label>
//                                         <Field className="form-control" type="text" name="description" />
//                                     </fieldset>

//                                     <fieldset className="form-group">
//                                         <label>In response to</label>
//                                         <Field className="form-control" type="number" name="inResponseTo" />
//                                     </fieldset>
//                                     <fieldset className="form-group">
//                                         <label>Lesson ID</label>
//                                         <Field className="form-control" type="number" name="lessonId" />
//                                     </fieldset>
//                                     <button className="btn btn-success" type="submit">Save</button>
//                                 </Form>
//                             )
//                         }

//                     </Formik>
//                 </div>
//             </div>
//         )
//     }

// }


// export default CommentComponent







// import React, { Component } from 'react'
// //import { Route, Redirect } from 'react-router-dom' //REACT-5
// import AuthenticationService from './AuthenticationService.js'
// import { Formik, Field, Form, ErrorMessage } from 'formik'
// import '../../RegisterComponent.css'


// class RegisterComponent extends Component {
//     constructor(props) {
//         super(props)
//         this.state = {
//             email: 'student1@gmail.com',
//             password: 'student1',
//             hasLoginFailed: false,
//             showSuccessMessage: false,
//             noUserFound: false,
//             authenticated: false,
//             registerEmail: '',
//             defaultPassword: ''
//         }

//         // this.handleEmailChange = this.handleEmailChange.bind(this)
//         // this.handlePasswordChange = this.handlePasswordChange.bind(this)
//         this.handleChange = this.handleChange.bind(this)

//         this.onSubmitRegister = this.onSubmitRegister.bind(this)
//         this.displayRegisterForm = this.displayRegisterForm.bind(this)
//     }




//     handleChange(event) {
//         //console.log(this.state);
//         this.setState(
//             {
//                 [event.target.name]: event.target.value
//             }
//         )
//     }
//     // handlePasswordChange(event){
//     //     console.log(event.target.value);
//     //     this.setState({password :event.target.value})    
//     // }
//     render() {
//         return (
//             <div className='RegisterMain'>
//                 <h1>Please register a new account</h1>
//                 <div className="container"></div>


//                 {this.state.showSuccessMessage && <div className="alert alert-success register">Successfully registered {this.state.email}</div>}
//                 {this.displayRegisterForm()}

//             </div>

//         )
//     }

//     displayRegisterForm() {
//         let { registerEmail, registerPassword } = this.state

//         return (


//             <div className='actualForm'>

//                 <Formik

//                     initialValues={{ registerEmail, registerPassword }}
//                     onSubmit={this.onSubmitRegister}
//                     validateOnBlur={false}
//                     validateOnChange={false}
//                     // validate={this.validate}
//                     enableReinitialize={true}
//                 >
//                     {
//                         (props) => (
//                             <Form className='registerForm'>
//                                 <ErrorMessage name="registerEmail" component="div"
//                                     className="alert alert-warning" />
//                                 {/* <ErrorMessage name="inResponseTo" component="div"
//             className="alert alert-warning" /> */}




//                                 <fieldset className="form-group">
//                                     <label>Email/username</label>
//                                     <Field className="form-control" type="text" name="registerEmail" />
//                                 </fieldset>

//                                 <fieldset className="form-group">
//                                     <label>Password</label>
//                                     <Field className="form-control" type="text" name="registerPassword" />
//                                 </fieldset>

//                                 <fieldset className="form-group">
//                                     <label>User type</label>
//                                     <Field
//                                         className="form-control"
//                                         as="select"
//                                         // onChange={this.onItemTypeDropdownSelected}
//                                         name="registerUserType"
//                                     >
//                                         <option value="2">Student</option>
//                                         <option value="1">Instructor</option>
//                                     </Field>
//                                 </fieldset> 


//                                 <button className="btn btn-success register" type="submit">Register account</button>
//                             </Form>
//                         )
//                     }
//                 </Formik>
//             </div>



//         )
//     }

//     onSubmitRegister(values) {

//         let applicationUser = {
//             email:values.registerEmail,
//             password: values.registerPassword,
//             userType : values.registerUserType == 1? "instructor":"student"
//         }

//         // console.log(values.registerEmail + "x" + values.registerPassword)
//         AuthenticationService.createUser(applicationUser
//         ).then(
//             //When successfully created user
//             () => {
//                 // this.props.navigate("/comments")
//                 this.setState({
//                 showSuccessMessage:true,
//                 email:applicationUser['email']});

//                 console.log("Successfully created user " + applicationUser['email'])

//             }



//         ).catch(
//             error => this.setState({
//                 successMessage: error.response.data.message
//             })
//         )

//     }

// }





export default CourseComponent