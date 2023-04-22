import React, { Component } from 'react'
//import { Route, Redirect } from 'react-router-dom' //REACT-5
import CommentDataService from '../../api/comment/CommentDataService.js'
import AuthenticationService from './AuthenticationService.js'
import moment from 'moment/moment'

import EnrolledDataService from '../../api/enrolled/EnrolledDataService.js'
import CourseDataService from '../../api/course/CourseDataService.js'
import BarChart from './BarChart.js'

class ProfilePageComponent extends Component {
    constructor(props) {
        super(props)


        this.state = {

            applicationUserId: this.props.params === undefined ? undefined : this.props.params.applicationUserId,
            message: null,
            courses: [],
            // toEnroll: { 1: false, 2: true, 3: false }
            enrolledCourses: [],
            username: "",
            interests: "",
            appplicationUserDetails: {},
            createdCourses: []
        }
        // this.deleteCommentClicked = this.deleteCommentClicked.bind(this)
        // this.updateCommentClicked = this.updateCommentClicked.bind(this)
        this.refreshCourses = this.refreshCourses.bind(this)
        // this.updateCommentClicked = this.updateCommentClicked.bind(this)
        // this.addCommentClicked = this.addCommentClicked.bind(this)
        this.unenrollInCourse = this.unenrollInCourse.bind(this)
        this.determineCreatedCourses = this.determineCreatedCourses.bind(this)
        this.returnD3Chart = this.returnD3Chart.bind(this)


    }


    componentDidMount() {
        // let username = AuthenticationService.getLoggedInUserName()
        // CommentDataService.retrieveAllComments(username)
        // .then(
        //     response=>{
        //         // console.log(response)
        //         this.setState({comments:response.data})
        //     }

        // )   
        console.log("componentDidMount")



        if (this.state.applicationUserId === undefined) {
            //if viewing own profile using HeaderComponent.jsx Profile Page link
            this.setState({
                username: AuthenticationService.getLoggedInUserName()
            }, () => {
                AuthenticationService.checkIfApplicationUserExists({ email: this.state.username })
                    .then(
                        response => {
                            this.setState({
                                interests: response.data.interests
                            })

                            this.setState({
                                appplicationUserDetails: response.data
                            }, () => {
                                console.log("user details: " + typeof (this.state.appplicationUserDetails.userType))
                                this.determineCreatedCourses();
                            })
                        }
                    )
            })


            this.determineEnrolled(AuthenticationService.getLoggedInUserName());
        } else {
            //if viewing someone elses profile through Search Students in HeaderCompnent.jsx -> View Profile



            AuthenticationService.findUserByApplicationUserId(this.state.applicationUserId)
                .then(
                    response => {
                        this.setState({
                            interests: response.data.interests
                        })

                        this.setState({
                            appplicationUserDetails: response.data
                        }, () => {
                            console.log("user details: " + typeof (this.state.appplicationUserDetails.userType))

                        })
                    }
                )


        }


        // this.returnD3Chart();





        console.log(this.state)
    }

    refreshCourses() {
        let username = AuthenticationService.getLoggedInUserName()
        CourseDataService.retrieveAllCourses()
            .then(
                response => {
                    // console.log(response)

                    this.setState({ courses: response.data }, () => {
                        var tmp = []
                        for (var i = 0; i < this.state.courses.length; i++) {
                            tmp.push(this.state.courses[i])
                            tmp[i][i] = this.state.toEnroll[i]
                        }
                        this.setState({ courses: tmp }, () => {
                            console.log("finalized courses: " + JSON.stringify(this.state.courses))
                        })
                    })
                    // this.forceUpdate()
                }

            )
        // this.determineEnrolled(username);
    }


    unenrollInCourse(courseId) {

        this.props.navigate(`/course/${courseId}`)
        // var enrolled = {
        //     username: AuthenticationService.getLoggedInUserName(),
        //     courseId: id
        // }

        // EnrolledDataService.createEnrolled(enrolled)
        //     .then(
        //         response => {
        //             this.refreshCourses();
        //         }
        //     )
    }

    viewCourseDetails(courseId) {
        this.props.navigate(`/course/${courseId}/${this.state.appplicationUserDetails['id']}`)
    }


    determineEnrolled(username) {
        // var enrolled = {
        //     courseId: courseId,
        //     username: AuthenticationService.getLoggedInUserName()
        // }
        // console.log(enrolled['courseId'] + " " + enrolled['username'])



        EnrolledDataService.retrieveEnrolledCourseDetails(username)
            .then(
                response => {
                    console.log("in retrieveEnrolledCourseDetails")
                    console.log("response: " + JSON.stringify(response.data))
                    if (response.data.length != 0) {

                        this.setState({ enrolledCourses: response.data }, () => {
                            console.log("Enrolled courses: " + JSON.stringify(this.state.enrolledCourses))



                        })


                        // console.log("not undefined")
                        // var en = {}
                        // var enCourses = []
                        // for (var i = 0; i < response.data.length; i++) {
                        //     en[i] = true;
                        //     enCourses.push(i)
                        // }

                        // for (var j = 0; j < totalCourses; j++) {
                        //     if (!enCourses.includes(j)) {
                        //         en[j] = false;
                        //     }
                        // }

                        // this.setState({
                        //     toEnroll: en
                        // }, () => {
                        //     console.log(this.state.toEnroll)
                        //     this.refreshCourses()
                        // })

                        // return true;
                    } else {
                        console.log("No enrolled courses")
                        // this.refreshCourses()
                        return false;
                    }
                }
            )






        // CourseDataService.retrieveAllCourses()
        //     .then(
        //         response => {
        //             var totalCourses = response.data.length;
        //             console.log("total number of courses:" + response.data.length);


        //         }
        //     )

        // return true;
    }


    // determineInterests(){
    //     AuthenticationService.checkIfApplicationUserExists({email:AuthenticationService.})
    // }

    determineCreatedCourses() {
        CourseDataService.retrieveCourseByInstructorApplicationUserId(this.state.appplicationUserDetails.id)
            .then(
                response => {
                    this.setState({ createdCourses: response.data })
                    console.log("created courses: " + JSON.stringify(this.state.createdCourses))
                }
            )
    }

    returnD3Chart() {
        return (
            <BarChart
                data={[12, 5, 6, 6, 9, 10]}
                width={700}
                height={300} />
        )
    }
    // const myContainer = useRef(null);

    // useEffect(() => {
    //     console.log("myContainer..", myContainer.current);
    // });
    render() {
        return (

            <div>


                {this.state.applicationUserId === undefined && (<>
                    <h1>List of all enrolled courses</h1>
                    {this.state.message && <div className="alert alert-success">{this.state.message}</div>}
                    <div className="container">
                        {
                            <table className="table">
                                <thead>
                                    <tr>

                                        <th>Course title</th>
                                        <th>Course description</th>
                                        <th>Instructor</th>
                                        <th>Unenroll or view course details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.enrolledCourses.map(
                                            course =>
                                                <>
                                                    <tr key={course.id}>
                                                        <td>{course.title}</td>
                                                        <td>{course.description}</td>
                                                        <td>{course.instructorApplicationUserId}</td>

                                                        <td>{(<button className="btn btn-success" onClick={() => this.unenrollInCourse(course.id)}>Unenroll/view</button>)}</td>

                                                    </tr>
                                                    {/* <tr>
                                                    {(<button className="btn btn-success" onClick={() => this.unenrollInCourse(course.id)}>View course </button>)}
                                                    </tr> */}
                                                </>
                                        )
                                    }
                                </tbody>
                            </table>



                            // { <div className="row">
                            //     <button className='btn btn-success' onClick={this.addCommentClicked}>Add comment</button>
                            // </div> 

                            // }
                        }

                    </div>


                </>)}
                <br></br>
                <br></br>



                <h1>Interested topics</h1>

                <div className="container" style={{ display: "inline-block", margin: '0.75rem', fontWeight: 'bold' }}>
                    {this.state.interests}

                </div>

                <br></br>
                <br></br>
                {(this.state.appplicationUserDetails.userType === "instructor" && this.state.applicationUserId === undefined) &&
                    (<>
                        <h1 style={{ marginTop: "2rem" }}>Created courses</h1>
                        <div className="container" >
                            <table className="table">
                                <thead>
                                    <tr>

                                        <th>Course title</th>
                                        <th>Course description</th>
                                        <th>Instructor</th>
                                        <th>View course details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.createdCourses.map(
                                            course =>
                                                <tr key={course.id}>
                                                    <td>{course.title}</td>
                                                    <td>{course.description}</td>
                                                    <td>{course.instructorApplicationUserId}</td>

                                                    <td>{(<button className="btn btn-success" onClick={() => this.viewCourseDetails(course.id)}>View course details</button>)}</td>

                                                </tr>
                                        )
                                    }
                                </tbody>
                            </table>

                        </div>
                    </>)
                }

                <br></br>

                <div className='viz' >
                    
                </div>
                {
                    this.returnD3Chart()
                }


            </div>
        )
    }

}

export default ProfilePageComponent;