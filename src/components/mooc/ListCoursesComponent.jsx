import React, { Component } from 'react'
//import { Route, Redirect } from 'react-router-dom' //REACT-5
import CommentDataService from '../../api/comment/CommentDataService.js'
import AuthenticationService from './AuthenticationService.js'
import moment from 'moment/moment'
import CourseDataService from '../../api/course/CourseDataService.js'
import EnrolledDataService from '../../api/enrolled/EnrolledDataService.js'

class ListCoursesComponent extends Component {
    constructor(props) {
        super(props)

        
        this.state = {

            message: null,

            courses: [],
            toEnroll: { 1: false, 2: true, 3: false }
        }
        // this.deleteCommentClicked = this.deleteCommentClicked.bind(this)
        // this.updateCommentClicked = this.updateCommentClicked.bind(this)
        this.refreshCourses = this.refreshCourses.bind(this)
        // this.updateCommentClicked = this.updateCommentClicked.bind(this)
        // this.addCommentClicked = this.addCommentClicked.bind(this)
        this.enrollInCourse = this.enrollInCourse.bind(this)

        
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
        
        this.determineEnrolled(AuthenticationService.getLoggedInUserName());
        console.log(this.state)
    }

    refreshCourses() {
        let username = AuthenticationService.getLoggedInUserName()
        CourseDataService.retrieveAllCourses()
            .then(
                response => {
                    // console.log(response)

                    this.setState({ courses: response.data },()=>{
                        var tmp = []
                        for(var i = 0; i<this.state.courses.length; i++){
                            tmp.push(this.state.courses[i])
                            tmp[i][i] = this.state.toEnroll[i]
                        }
                        this.setState({courses:tmp},()=>{
                            console.log("finalized courses: " + JSON.stringify(this.state.courses))
                        })
                    })
                    // this.forceUpdate()
                }

            )
        // this.determineEnrolled(username);
    }


    enrollInCourse(courseId) {

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

    // //When deleting comments
    // deleteCommentClicked(id) {
    //     let username = AuthenticationService.getLoggedInUserName()
    //     // console.log(id + " " + username)
    //     CommentDataService.deleteComment(username, id)
    //         .then(
    //             response => {
    //                 this.setState({ message: `Delete of todo ${id} successful.` })
    //                 this.refreshComments()
    //             }
    //         )
    // }
    // addCommentClicked() {
    //     console.log("create ")
    //     let id = -1
    //     this.props.navigate(`/comments/${id}`)

    // }

    // updateCommentClicked(id) {
    //     console.log("update " + id)
    //     this.props.navigate(`/comments/${id}`)
    //     // let username = AuthenticationService.getLoggedInUserName()
    //     // // console.log(id + " " + username)
    //     // CommentDataService.deleteComment(username, id)
    //     // .then(
    //     //     response=>{
    //     //         this.setState({message:`Delete of todo ${id} successful.`})
    //     //         this.refreshComments()
    //     //     }
    //     // )
    // }

    determineEnrolled(username) {
        // var enrolled = {
        //     courseId: courseId,
        //     username: AuthenticationService.getLoggedInUserName()
        // }
        // console.log(enrolled['courseId'] + " " + enrolled['username'])
        CourseDataService.retrieveAllCourses()
            .then(
                response => {
                    var totalCourses = response.data.length;
                    console.log("total number of courses:" + response.data.length);


                    EnrolledDataService.retrieveEnrolledByUsername(username)
                        .then(
                            response => {
                                console.log("response: " + JSON.stringify(response.data))
                                if (response.data.length != 0) {
                                    console.log("not undefined")
                                    var en = {}
                                    var enCourses = []
                                    for (var i = 0; i < response.data.length; i++) {
                                        en[i] = true;
                                        enCourses.push(i)
                                    }

                                    for (var j = 0; j < totalCourses; j++) {
                                        if (!enCourses.includes(j)) {
                                            en[j] = false;
                                        }
                                    }

                                    this.setState({
                                        toEnroll: en
                                    }, () => {
                                        console.log(this.state.toEnroll)
                                        this.refreshCourses()
                                    })

                                    // return true;
                                } else {
                                    console.log("undefined")
                                    return false;
                                }
                            }
                        )
                }
            )

        return true;
    }


    render() {
        return (

            <div>
                <h1>List of all courses available</h1>
                {this.state.message && <div className="alert alert-success">{this.state.message}</div>}
                <div className="container">
                    {
                        <table className="table">
                            <thead>
                                <tr>

                                    <th>Course title</th>
                                    <th>Course description</th>
                                    <th>Instructor</th>
                                    <th>Enroll in course</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.courses.map(
                                        course =>
                                            <tr key={course.id}>
                                                <td>{course.title}</td>
                                                <td>{course.description}</td>
                                                <td>{course.instructorApplicationUserId}</td>

                                                <td>{(<button className="btn btn-success" onClick={() => this.enrollInCourse(course.id)}>Enroll</button>)}</td>

                                            </tr>
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
            </div>
        )
    }

}

export default ListCoursesComponent