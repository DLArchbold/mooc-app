import React, { Component } from 'react'
//import { Route, Redirect } from 'react-router-dom' //REACT-5
import AuthenticationService from './AuthenticationService.js'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import '../../RegisterComponent.css'
import LessonDataService from '../../api/lesson/LessonDataService.js'
import CourseDataService from '../../api/course/CourseDataService.js'



class CreateLessonComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            userId: 0,
            courseId: 0,
            showSuccessMessage: false,
            lessonNumber: 0,
            lessonDescription: '',
            relatedCourse: 0,
            videoLink: '',
            possibleCourses: [],
            minLessonNumber: 0,
            showMinLessonWarning: false
        }

        // this.handleEmailChange = this.handleEmailChange.bind(this)
        // this.handlePasswordChange = this.handlePasswordChange.bind(this)
        this.handleChange = this.handleChange.bind(this)

        this.onSubmitCreateLesson = this.onSubmitCreateLesson.bind(this)
        this.displayCreateLessonForm = this.displayCreateLessonForm.bind(this)
        this.displayMinLessonNumber = this.displayMinLessonNumber.bind(this)
        this.validate = this.validate.bind(this)
        this.onsel = this.onsel.bind(this)
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
                <h1>Create a new lesson</h1>
                <div className="container"></div>


                {this.state.showSuccessMessage && <div className="alert alert-success register">Successfully created lesson {this.state.lessonTitle}</div>}

                {this.displayCreateLessonForm()}

            </div>

        )
    }

    componentDidMount() {
        this.setState({ email: AuthenticationService.getLoggedInUserName() }, () => {
            // console.log("this.state.email : " + this.state.email);
            AuthenticationService.checkIfApplicationUserExists({ 'email': this.state.email })
                .then(
                    response => {
                        // console.log(response.data)
                        this.setState({ userId: response.data['id'] }, () => {
                            // console.log(this.state.userId)

                            console.log("user ID: " + this.state.userId)
                            CourseDataService.retrieveCourseByInstructorApplicationUserId(this.state.userId)
                                .then(
                                    response => {

                                        //Instructor has at least 1 course
                                        if (response != undefined) {
                                            console.log("Instructor has at least 1 course")
                                            this.setState({ possibleCourses: response.data }, () => {
                                                console.log(this.state.possibleCourses)
                                                if (this.state.possibleCourses.length != 0) {
                                                    LessonDataService.retrieveLessonsByCourseId(this.state.possibleCourses[0]['id'])
                                                        .then(
                                                            response => {


                                                                if(response != undefined){
                                                                    
                                                                }else{

                                                                }

                                                                // if (response != undefined) {
                                                                //     //At least 1 lesson related to 1st course of instructor
                                                                //     console.log("//At least 1 lesson related to 1st course of instructor")
                                                                //     var minLessonNumberRetrieved = response.data[response.data.length - 1]['lessonNumber'];
                                                                //     console.log("minlessonnumber in cdm: " + minLessonNumberRetrieved)
                                                                //     this.setState({ minLessonNumber: minLessonNumberRetrieved + 1 })
                                                                // } else {
                                                                //     //No lesson related to 1st course
                                                                //     console.log("//No lesson related to 1st course")
                                                                //     this.setState({ minLessonNumber: 0 })
                                                                // }
                                                            }
                                                        )
                                                }

                                                // console.log("this.state.possibleCourses: " + JSON.stringify(this.state.possibleCourses))

                                                // var temp = [];
                                                // var temp1 = {};
                                                // console.log("JSON.stringify(this.state.possibleCourses.length" + " " + JSON.stringify(this.state.possibleCourses.length))
                                                // for (var i = 0; i < this.state.possibleCourses.length; i++) {
                                                //     //create map of max lesson numbers for all courses
                                                //     let temp2 = JSON.stringify(this.state.possibleCourses[i]['id'])

                                                //     console.log("this.state.possibleCourses[i]['id'] " + temp2)
                                                //     LessonDataService.retrieveLessonsByCourseId(this.state.possibleCourses[i]['id'])
                                                //         .then(
                                                //             // console.log('abc')
                                                //             response => {
                                                //                 console.log("Request successful")
                                                //                 if (response != undefined) {
                                                //                     console.log("Not undefined")
                                                //                     temp = response;
                                                //                     console.log("temp: " + temp)
                                                //                     var max;
                                                //                     for (var j = 0; j < temp.length; j++) {
                                                //                         //Find max lesson number for a course
                                                //                         if (temp[j]['lessonNumber'] > max) {
                                                //                             max = temp[j]['lessonNumber'];
                                                //                         }

                                                //                     }

                                                //                     // var courseId = i
                                                //                     temp1 = { ...temp1, i: max }
                                                //                     // let msg = JSON.stringify(this.state.possibleCourses[i]['id']);
                                                //                     console.log("Course ID: " + temp2 + " temp1: " + JSON.stringify(temp1));
                                                //                 } else {
                                                //                     console.log("Response is undefined")
                                                //                     console.log("ith possible course : " + i + " possibleCourses[i]['id'] " + temp2)
                                                //                 }

                                                //             }
                                                //         );

                                                //     // console.log(i + " 2temp1: " + JSON.stringify(temp1));
                                                // }

                                                // this.setState({})
                                            })
                                        } else {
                                            //Instructor has no course
                                            console.log("Instructor has no course")
                                        }



                                    }
                                )



                        })
                    }
                )
        })




    }
    displayCreateLessonForm() {
        let { lessonDescription,
            courseId, relatedCourse, videoLink } = this.state
        let lessonNumber = this.state.minLessonNumber;
        let selectedRelatedCourse = 4;
        return (


            <div className='actualForm'>

                <Formik

                    initialValues={{
                        lessonNumber, lessonDescription,
                        courseId, relatedCourse, videoLink
                    }}
                    onSubmit={this.onSubmitCreateLesson}
                    validateOnBlur={false}
                    validateOnChange={true}
                    validate={this.validate}
                    enableReinitialize={true}
                >
                    {
                        (props) => (
                            <Form className='registerForm'>
                                <ErrorMessage name="lessonNumber" component="div"
                                    className="alert alert-warning" />
                                {/* <ErrorMessage name="inResponseTo" component="div"
            className="alert alert-warning" /> */}
                                {this.state.showMinLessonWarning && <div className="alert alert-warning">Lesson number must be at least {this.state.minLessonNumber}</div>}
                                <fieldset className="form-group">
                                    <label>Lesson number</label>
                                    <Field className="form-control" type="text" name="lessonNumber" />
                                </fieldset>

                                <fieldset className="form-group">
                                    <label>Lesson description</label>
                                    <Field className="form-control" type="text" name="lessonDescription" />
                                </fieldset>

                                <fieldset className="form-group">
                                    <label>Related course</label>
                                    <Field
                                        className="form-control"
                                        as="select"
                                        // onChange={(event)=>
                                        // {
                                        //     console.log(event.target.value)
                                        // }}
                                        name="relatedCourse"
                                    // defaultValue ={"4"}
                                    >
                                        {/* <option value="-1">Select one of your courses</option> */}
                                        {this.state.possibleCourses.map(
                                            possibleCourse =>
                                                <>
                                                    <option value={`${possibleCourse['id']}`} >{possibleCourse['title']}</option>
                                                </>
                                        )}
                                        {/* <option value="2">Student</option>
                                        <option value="1">Instructor</option> */}
                                    </Field>
                                </fieldset>

                                <fieldset className="form-group">
                                    <label>Video link</label>
                                    <Field className="form-control" type="text" name="videoLink" />
                                </fieldset>


                                <button className="btn btn-success register" type="submit">Create Lesson</button>
                            </Form>
                        )
                    }
                </Formik>
            </div>



        )
    }

    onsel() {
        console.log("onsel")
    }
    displayMinLessonNumber(event) {
        console.log('minlessonnumber' + event.target.value)

        // LessonDataService.retrieveLessonsByCourseId()



    }

    validate(values) {

        let errors = {}
        // console.log(values.lessonNumber)
        if (values.lessonNumber < this.state.minLessonNumber) {
            this.setState({ showMinLessonWarning: true })
            errors.description = "Minimum lesson number must be at least " + this.state.minLessonNumber;
        } else if (values.lessonNumber.length == 0) {
            this.setState({ showMinLessonWarning: true })
            // errors.description = "Enter a lesson number"
        } else if (values.lessonNumber >= this.state.minLessonNumber) {
            this.setState({ showMinLessonWarning: false })
        }

        // if (values.relatedCourse != "-1") {
        //     LessonDataService.retrieveLessonsByCourseId(values.relatedCourse)
        //         .then(
        //             response => {

        //                 if (response != undefined) {
        //                     //At least 1 lesson related to selected course of instructor
        //                     console.log("//At least 1 lesson related to selected course of instructor")
        //                     var minLessonNumberRetrieved = response.data[response.data.length - 1]['lessonNumber'];
        //                     console.log("minlessonnumber in cdm: " + minLessonNumberRetrieved)
        //                     this.setState({ minLessonNumber: minLessonNumberRetrieved + 1 })
        //                 } else {
        //                     //No lesson related selected course
        //                     console.log("No lesson related to selected course")
        //                     this.setState({ minLessonNumber: 0 })
        //                 }
        //             }
        //         )
        // }
        console.log("values anc:" + JSON.stringify(values))



        return errors
    }

    onSubmitCreateLesson(values) {
        console.log("in onSubmitCreateLesson " + JSON.stringify(values))
        let lesson = {
            lessonNumber: values.lessonNumber,
            description: values.lessonDescription,
            videoLink: values.videoLink,
            courseId: values.relatedCourse,
            instructorApplicationUserId: this.state.userId
        }

        // console.log(values.registerEmail + "x" + values.registerPassword)
        LessonDataService.createLesson(lesson
        ).then(

            //When successfully created lesson
            response => {
                console.log("response: " + response)
                // this.props.navigate("/comments")
                this.setState({
                    // courseTitle: values.courseTitle,
                    showSuccessMessage: true,
                    lessonDescription: values.lessonDescription
                }, () => {
                    console.log("Successfully created lesson " + this.state.lessonDescription)
                });



            }



        ).catch(
            error => this.setState({
                successMessage: error.response.data.message
            })
        )

    }

}





export default CreateLessonComponent